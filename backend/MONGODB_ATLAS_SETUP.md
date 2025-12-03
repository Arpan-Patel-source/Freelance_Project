# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Sign up for a free account (or log in if you already have one)
3. Click "Build a Database"

## Step 2: Create a Free Cluster

1. Choose **M0 FREE** tier (perfect for development)
2. Select your preferred **Cloud Provider** (AWS, Google Cloud, or Azure)
3. Choose a **Region** closest to you for better performance
4. Give your cluster a name (or keep the default "Cluster0")
5. Click **"Create"** (this takes 3-5 minutes)

## Step 3: Create Database User

1. In the **Security** section, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter a username (e.g., `admin` or `dbuser`)
5. Click **"Autogenerate Secure Password"** or create your own
6. **⚠️ IMPORTANT: Copy and save this password somewhere safe!**
7. Set user privileges to **"Read and write to any database"**
8. Click **"Add User"**

## Step 4: Whitelist Your IP Address

1. In the **Security** section, click **"Network Access"**
2. Click **"Add IP Address"**
3. Choose one of these options:
   - **"Add Current IP Address"** (for your current location)
   - **"Allow Access from Anywhere"** (0.0.0.0/0) - easier for development but less secure
4. Click **"Confirm"**

## Step 5: Get Your Connection String

1. Go back to **"Database"** in the left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Select **Driver: Node.js** and **Version: 5.5 or later**
5. Copy the connection string (it looks like this):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Configure Your .env File

1. Open or create `.env` file in your `backend` folder
2. Add your MongoDB connection string:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/freelance_platform?retryWrites=true&w=majority
   ```

3. **Replace the following:**
   - `<username>` → Your database username (from Step 3)
   - `<password>` → Your database password (from Step 3)
   - Add your database name after `.net/` (e.g., `freelance_platform`)

4. **Example:**
   ```
   MONGO_URI=mongodb+srv://admin:MySecurePass123@cluster0.abc123.mongodb.net/freelance_platform?retryWrites=true&w=majority
   ```

5. Add other required environment variables:
   ```
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=30d
   CLIENT_URL=http://localhost:5173
   ```

## Step 7: Test Your Connection

1. Make sure all dependencies are installed:
   ```bash
   cd backend
   npm install
   ```

2. Start your server:
   ```bash
   npm run dev
   ```

3. You should see:
   ```
   ✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
   🚀 Server running in development mode on port 5000
   ```

## Troubleshooting

### Connection Timeout Error
- Check if your IP address is whitelisted in Network Access
- Try allowing access from anywhere (0.0.0.0/0)

### Authentication Failed
- Double-check your username and password
- Make sure there are no special characters that need URL encoding
- If password has special characters, encode them:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - `%` → `%25`

### Database Not Found
- The database will be created automatically when you first insert data
- Make sure you specified a database name in the connection string

## Viewing Your Data

1. Go to MongoDB Atlas Dashboard
2. Click **"Browse Collections"** on your cluster
3. You'll see your databases and collections here
4. You can manually add, edit, or delete documents

## Additional Tips

- **Free Tier Limits:** 512 MB storage, shared RAM, no backups
- **Upgrade:** You can upgrade to paid tiers for more resources
- **Monitoring:** Use the Atlas dashboard to monitor database performance
- **Backups:** Enable automated backups in paid tiers

---

✅ Once connected, your application will automatically create collections based on your Mongoose models!
