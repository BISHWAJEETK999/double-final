# 🗄️ Fix Data Loss Issue on Render

## The Problem
Your admin changes get deleted after a few hours because Render restarts your app and it's using in-memory storage.

## The Solution
Add a PostgreSQL database to make your changes permanent.

## Step-by-Step Setup

### 1. Add PostgreSQL Database on Render

1. Go to your **Render Dashboard**
2. Click **"New"** → **"PostgreSQL"**
3. Fill in the details:
   - **Name**: `ttravel-database`
   - **Database**: `ttravel`  
   - **User**: `admin`
   - **Region**: Same as your web service
   - **PostgreSQL Version**: 15
   - **Plan**: Free (or paid for better performance)

4. Click **"Create Database"**

### 2. Connect Database to Your App

1. Go to your **Web Service** (your travel app)
2. Click **"Environment"** tab
3. Add this environment variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Copy the "External Database URL" from your PostgreSQL dashboard

4. Click **"Save Changes"**

### 3. Deploy Database Schema

Your app will automatically create all necessary tables when it starts with the DATABASE_URL.

## Verification

After adding the DATABASE_URL:

1. Your app will restart automatically
2. Check the logs - you should see "Using PostgreSQL database"
3. Login to admin and make a test change
4. Wait a few hours - your changes will stay permanent!

## Quick Alternative: Railway

If Render's database setup is complex, try Railway:

1. Go to [railway.app](https://railway.app)
2. Deploy your GitHub repo
3. Add PostgreSQL from Railway's templates
4. Connect automatically - no manual setup needed

## Cost
- **Render**: Free PostgreSQL tier available
- **Railway**: $5/month for database + hosting combined

Your travel booking platform will then keep all admin changes permanently!