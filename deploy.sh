#!/bin/bash

echo "🎥 RandomVideoChat.com - Deployment Script"
echo "=========================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - RandomVideoChat.com"
fi

echo ""
echo "🚀 Choose your deployment platform:"
echo "1) Railway (Recommended - Free tier available)"
echo "2) Render (Free tier available)"
echo "3) Heroku (Paid)"
echo "4) VPS (Manual setup)"
echo "5) Local development"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo "🚂 Deploying to Railway..."
        echo "1. Go to https://railway.app"
        echo "2. Sign up with GitHub"
        echo "3. Click 'New Project' -> 'Deploy from GitHub repo'"
        echo "4. Select this repository"
        echo "5. Railway will auto-deploy and give you a domain"
        echo ""
        echo "Your app will be available at: https://your-app-name.railway.app"
        ;;
    2)
        echo "🎨 Deploying to Render..."
        echo "1. Go to https://render.com"
        echo "2. Sign up with GitHub"
        echo "3. Click 'New' -> 'Web Service'"
        echo "4. Connect your GitHub repository"
        echo "5. Set build command: npm install"
        echo "6. Set start command: npm start"
        echo "7. Click 'Create Web Service'"
        echo ""
        echo "Your app will be available at: https://your-app-name.onrender.com"
        ;;
    3)
        echo "🦸 Deploying to Heroku..."
        if ! command -v heroku &> /dev/null; then
            echo "Installing Heroku CLI..."
            npm install -g heroku
        fi
        echo "1. Run: heroku login"
        echo "2. Run: heroku create your-app-name"
        echo "3. Run: git push heroku main"
        echo ""
        echo "Your app will be available at: https://your-app-name.herokuapp.com"
        ;;
    4)
        echo "🖥️  VPS Deployment Instructions:"
        echo "1. Get a VPS (DigitalOcean, AWS, etc.)"
        echo "2. Install Node.js: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs"
        echo "3. Install PM2: npm install -g pm2"
        echo "4. Clone this repository"
        echo "5. Run: npm install"
        echo "6. Run: pm2 start server.js --name randomvideochat"
        echo "7. Configure your domain DNS to point to your server IP"
        echo "8. Set up SSL with Let's Encrypt"
        ;;
    5)
        echo "💻 Starting local development server..."
        npm run dev
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🌐 To set up a custom domain (e.g., randomvideochat.com):"
echo "1. Buy a domain from Namecheap, GoDaddy, etc."
echo "2. Point DNS to your deployment URL"
echo "3. Most platforms provide automatic SSL"
echo ""
echo "📚 For detailed instructions, see README.md"
echo ""
echo "🎉 Happy chatting! 🌍"
