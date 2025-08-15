(() => {
  const socket = io();

  const startBtn = document.getElementById('startBtn');
  const nextBtn = document.getElementById('nextBtn');
  const disconnectBtn = document.getElementById('disconnectBtn');
  const muteBtn = document.getElementById('muteBtn');
  const cameraBtn = document.getElementById('cameraBtn');
  const localVideo = document.getElementById('localVideo');
  const remoteVideo = document.getElementById('remoteVideo');
  const chatLog = document.getElementById('chatLog');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');

  let localStream = null;
  let peerConnection = null;
  let dataChannel = null;
  let currentPeerId = null;
  let isInitiator = false;

  const rtcConfig = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  };

  function logChat(from, message) {
    const row = document.createElement('div');
    row.textContent = `${from}: ${message}`;
    chatLog.appendChild(row);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function setControlsDuringCall(inCall) {
    nextBtn.disabled = !inCall;
    disconnectBtn.disabled = !inCall;
    muteBtn.disabled = !inCall;
    cameraBtn.disabled = !inCall;
    startBtn.disabled = inCall;
  }

  function cleanUpPeer() {
    if (dataChannel) {
      try { dataChannel.close(); } catch (_) {}
      dataChannel = null;
    }
    if (peerConnection) {
      try { peerConnection.close(); } catch (_) {}
      peerConnection = null;
    }
    currentPeerId = null;
    isInitiator = false;
    if (remoteVideo.srcObject) {
      remoteVideo.srcObject.getTracks().forEach(t => t.stop());
    }
    remoteVideo.srcObject = null;
    setControlsDuringCall(false);
  }

  async function ensureLocalStream() {
    if (localStream) return localStream;
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;
    return localStream;
  }

  function createPeer() {
    peerConnection = new RTCPeerConnection(rtcConfig);
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && currentPeerId) {
        socket.emit('signal', { to: currentPeerId, data: { candidate: event.candidate } });
      }
    };
    peerConnection.ontrack = (event) => {
      remoteVideo.srcObject = event.streams[0];
    };
    peerConnection.onconnectionstatechange = () => {
      if (peerConnection && ['failed', 'disconnected', 'closed'].includes(peerConnection.connectionState)) {
        // Let server control reconnection via next/peerDisconnected
      }
    };

    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    if (isInitiator) {
      dataChannel = peerConnection.createDataChannel('chat');
      wireDataChannel(dataChannel);
    } else {
      peerConnection.ondatachannel = (event) => {
        dataChannel = event.channel;
        wireDataChannel(dataChannel);
      };
    }
  }

  function wireDataChannel(channel) {
    channel.onopen = () => {};
    channel.onmessage = (ev) => {
      logChat('Stranger', ev.data);
    };
  }

  async function startCallFlow() {
    await ensureLocalStream();
    socket.emit('find');
    startBtn.disabled = true;
  }

  startBtn.addEventListener('click', () => startCallFlow());
  nextBtn.addEventListener('click', () => {
    socket.emit('next');
    cleanUpPeer();
  });
  disconnectBtn.addEventListener('click', () => {
    socket.emit('next');
    cleanUpPeer();
    startBtn.disabled = false;
  });

  muteBtn.addEventListener('click', () => {
    if (!localStream) return;
    const audioTracks = localStream.getAudioTracks();
    if (audioTracks[0]) {
      audioTracks[0].enabled = !audioTracks[0].enabled;
      muteBtn.textContent = audioTracks[0].enabled ? 'Mute' : 'Unmute';
    }
  });

  cameraBtn.addEventListener('click', () => {
    if (!localStream) return;
    const videoTracks = localStream.getVideoTracks();
    if (videoTracks[0]) {
      videoTracks[0].enabled = !videoTracks[0].enabled;
      cameraBtn.textContent = videoTracks[0].enabled ? 'Camera Off' : 'Camera On';
    }
  });

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;
    if (dataChannel && dataChannel.readyState === 'open') {
      dataChannel.send(message);
      logChat('You', message);
      chatInput.value = '';
    }
  });

  // Socket events
  socket.on('waiting', () => {
    setControlsDuringCall(false);
  });

  socket.on('matched', async ({ peerId, isInitiator: flag }) => {
    currentPeerId = peerId;
    isInitiator = !!flag;
    await ensureLocalStream();
    createPeer();
    setControlsDuringCall(true);

    if (isInitiator) {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit('signal', { to: currentPeerId, data: { description: offer } });
    }
  });

  socket.on('signal', async ({ from, data }) => {
    if (!peerConnection || from !== currentPeerId) return;
    if (data.description) {
      const description = data.description;
      if (description.type === 'offer') {
        await peerConnection.setRemoteDescription(description);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit('signal', { to: currentPeerId, data: { description: answer } });
      } else if (description.type === 'answer') {
        await peerConnection.setRemoteDescription(description);
      }
    } else if (data.candidate) {
      try {
        await peerConnection.addIceCandidate(data.candidate);
      } catch (_) {}
    }
  });

  socket.on('peerDisconnected', () => {
    cleanUpPeer();
    // Automatically try to find a new partner
    socket.emit('find');
  });
})();
