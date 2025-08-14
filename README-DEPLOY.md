# 🚀 Easy Deployment Guide

Deploy TTravel Hospitality anywhere with zero configuration!

## 🐳 Docker Deployment (Recommended)

### One-Command Deploy
```bash
chmod +x deploy.sh && ./deploy.sh
```

### Manual Docker Deploy
```bash
# Build and run
docker-compose up --build -d

# View your app at http://localhost:5000
```

## 🌐 Platform-Specific Deployments

### Railway
1. Connect your GitHub repository
2. Railway will auto-detect and deploy
3. Set environment variable: `NODE_ENV=production`

### Render
1. Connect repository
2. Use these settings:
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Environment: Node.js

### Heroku
```bash
# Install Heroku CLI, then:
heroku create your-app-name
git push heroku main
```

### DigitalOcean App Platform
1. Connect repository
2. Select Node.js
3. Auto-deploy enabled

### Vercel/Netlify
- These platforms work best for static sites
- For full-stack apps, use Railway or Render instead

## 🔧 Environment Variables

The app works out of the box, but you can customize:

```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://... # Optional: for PostgreSQL
```

## 🔐 Default Admin Access

- **URL**: `http://your-domain/admin`
- **Username**: admin
- **Password**: Ttrave

**⚠️ Change the admin password after first login!**

## 📊 Features Ready

✅ Travel package management
✅ Contact form submissions
✅ Newsletter subscriptions  
✅ Image gallery with uploads
✅ Mobile-responsive design
✅ Admin dashboard
✅ Content management

## 🆘 Troubleshooting

**Port already in use?**
```bash
docker-compose down
docker-compose up -d
```

**Need to change port?**
Edit `docker-compose.yml` and change `"5000:5000"` to `"YOUR_PORT:5000"`

**Database issues?**
The app uses in-memory storage by default. For persistence, uncomment the PostgreSQL service in `docker-compose.yml`

## 📞 Support

Your travel booking platform is ready to handle real customers and bookings!