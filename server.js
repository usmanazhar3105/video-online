const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Simple random matchmaking (like Omegle)
const waitingQueue = [];
const partnerBySocketId = new Map();

function removeFromWaiting(socketId) {
  const index = waitingQueue.indexOf(socketId);
  if (index !== -1) waitingQueue.splice(index, 1);
}

function getPartner(socketId) {
  return partnerBySocketId.get(socketId) || null;
}

function clearPair(socketId) {
  const partnerId = partnerBySocketId.get(socketId);
  if (partnerId) {
    partnerBySocketId.delete(partnerId);
  }
  partnerBySocketId.delete(socketId);
}

function pairSockets(aId, bId) {
  partnerBySocketId.set(aId, bId);
  partnerBySocketId.set(bId, aId);
  io.to(aId).emit('matched', { peerId: bId, isInitiator: true });
  io.to(bId).emit('matched', { peerId: aId, isInitiator: false });
}

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  socket.on('find', () => {
    removeFromWaiting(socket.id);
    const candidate = waitingQueue.shift();
    if (candidate && candidate !== socket.id) {
      pairSockets(candidate, socket.id);
    } else {
      waitingQueue.push(socket.id);
      io.to(socket.id).emit('waiting');
    }
  });

  socket.on('signal', (payload) => {
    const { to, data } = payload || {};
    if (typeof to === 'string') {
      io.to(to).emit('signal', { from: socket.id, data });
    }
  });

  socket.on('next', () => {
    const partnerId = getPartner(socket.id);
    if (partnerId) {
      io.to(partnerId).emit('peerDisconnected');
      clearPair(partnerId);
    }
    clearPair(socket.id);
    removeFromWaiting(socket.id);
    const candidate = waitingQueue.shift();
    if (candidate && candidate !== socket.id) {
      pairSockets(candidate, socket.id);
    } else {
      waitingQueue.push(socket.id);
      io.to(socket.id).emit('waiting');
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    removeFromWaiting(socket.id);
    const partnerId = getPartner(socket.id);
    if (partnerId) {
      io.to(partnerId).emit('peerDisconnected');
      clearPair(partnerId);
    }
    clearPair(socket.id);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Video Chat Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${NODE_ENV}`);
  console.log(`📱 Access: http://localhost:${PORT}`);
  console.log(`🔗 For external access, use your server's IP or domain`);
});
