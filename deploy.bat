@echo off
echo 🎥 RandomVideoChat.com - Deployment Script
echo ==========================================

echo.
echo 🚀 Choose your deployment platform:
echo 1) Railway (Recommended - Free tier available)
echo 2) Render (Free tier available)
echo 3) Heroku (Paid)
echo 4) VPS (Manual setup)
echo 5) Local development
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto railway
if "%choice%"=="2" goto render
if "%choice%"=="3" goto heroku
if "%choice%"=="4" goto vps
if "%choice%"=="5" goto local
goto invalid

:railway
echo 🚂 Deploying to Railway...
echo 1. Go to https://railway.app
echo 2. Sign up with GitHub
echo 3. Click 'New Project' -^> 'Deploy from GitHub repo'
echo 4. Select this repository
echo 5. Railway will auto-deploy and give you a domain
echo.
echo Your app will be available at: https://your-app-name.railway.app
goto end

:render
echo 🎨 Deploying to Render...
echo 1. Go to https://render.com
echo 2. Sign up with GitHub
echo 3. Click 'New' -^> 'Web Service'
echo 4. Connect your GitHub repository
echo 5. Set build command: npm install
echo 6. Set start command: npm start
echo 7. Click 'Create Web Service'
echo.
echo Your app will be available at: https://your-app-name.onrender.com
goto end

:heroku
echo 🦸 Deploying to Heroku...
echo 1. Install Heroku CLI from https://devcenter.heroku.com/articles/heroku-cli
echo 2. Run: heroku login
echo 3. Run: heroku create your-app-name
echo 4. Run: git push heroku main
echo.
echo Your app will be available at: https://your-app-name.herokuapp.com
goto end

:vps
echo 🖥️  VPS Deployment Instructions:
echo 1. Get a VPS (DigitalOcean, AWS, etc.)
echo 2. Install Node.js and PM2
echo 3. Clone this repository
echo 4. Run: npm install
echo 5. Run: pm2 start server.js --name randomvideochat
echo 6. Configure your domain DNS to point to your server IP
echo 7. Set up SSL with Let's Encrypt
goto end

:local
echo 💻 Starting local development server...
npm run dev
goto end

:invalid
echo ❌ Invalid choice. Please run the script again.
goto end

:end
echo.
echo 🌐 To set up a custom domain (e.g., randomvideochat.com):
echo 1. Buy a domain from Namecheap, GoDaddy, etc.
echo 2. Point DNS to your deployment URL
echo 3. Most platforms provide automatic SSL
echo.
echo 📚 For detailed instructions, see README.md
echo.
echo 🎉 Happy chatting! 🌍
pause
