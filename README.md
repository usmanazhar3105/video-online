# 🎥 RandomVideoChat.com

A modern, Omegle-like random video chat platform built with WebRTC and Socket.IO.

## 🌟 Features

- **Random Video Chat**: Connect with strangers worldwide
- **Text Chat**: Send messages during video calls
- **Modern UI**: Clean, responsive design
- **Real-time**: WebRTC peer-to-peer connections
- **Cross-platform**: Works on desktop and mobile

## 🚀 Quick Start

### Local Development
```bash
npm install
npm run dev
```
Visit `http://localhost:3000`

### Production Deployment

#### Option 1: Deploy to Railway (Recommended)
1. Create account at [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Railway will auto-deploy and provide a domain like `your-app.railway.app`

#### Option 2: Deploy to Render
1. Create account at [Render.com](https://render.com)
2. Create new Web Service
3. Connect your repository
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Get domain like `your-app.onrender.com`

#### Option 3: Deploy to Heroku
1. Create account at [Heroku.com](https://heroku.com)
2. Install Heroku CLI
3. Run:
```bash
heroku create your-app-name
git add .
git commit -m "Initial commit"
git push heroku main
```

#### Option 4: VPS Deployment
1. Get a VPS (DigitalOcean, AWS, etc.)
2. Install Node.js and PM2
3. Clone repository
4. Run:
```bash
npm install
npm run start
```

## 🌐 Custom Domain Setup

### 1. Buy a Domain
Purchase a domain from providers like:
- Namecheap
- GoDaddy
- Google Domains
- Cloudflare

### 2. Configure DNS
Point your domain to your deployment:

**For Railway:**
```
Type: CNAME
Name: @
Value: your-app.railway.app
```

**For Render:**
```
Type: CNAME
Name: @
Value: your-app.onrender.com
```

**For VPS:**
```
Type: A
Name: @
Value: YOUR_SERVER_IP
```

### 3. SSL Certificate
Most platforms (Railway, Render, Heroku) provide automatic SSL.
For VPS, use Let's Encrypt:
```bash
sudo apt install certbot
sudo certbot --nginx -d yourdomain.com
```

## 🔧 Environment Variables

Create a `.env` file:
```env
PORT=3000
NODE_ENV=production
```

## 📱 Usage

1. **Start Chat**: Click "Start Chat" to join the queue
2. **Connect**: Get matched with a random stranger
3. **Chat**: Use video/audio and text chat
4. **Next**: Click "Next" to find a new partner
5. **Disconnect**: End the current session

## 🛡️ Security & Moderation

⚠️ **Important**: This is a basic implementation. For production, consider:

- Rate limiting
- User reporting system
- Content moderation
- Age verification
- Abuse prevention
- Privacy policy
- Terms of service

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, Socket.IO
- **Frontend**: Vanilla JavaScript, WebRTC
- **Styling**: CSS3 with responsive design
- **Deployment**: Railway/Render/Heroku/VPS

## 📄 License

MIT License - feel free to use and modify!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**RandomVideoChat.com** - Connect with the world, one stranger at a time! 🌍
"# online-video-chatting" 
"# video-online" 
