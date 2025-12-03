# 🔧 Login Troubleshooting Guide

## Quick Fix Checklist

Run through these steps in order:

### ✅ Step 1: Is the Backend Server Running?

**Check:** Open http://localhost:5000/api/health in your browser

**Expected:** Should see `{"status":"OK","message":"Server is running"}`

**If not working:**
```bash
cd backend
npm run dev
```

You should see output like:
```
🚀 Server running in development mode on port 5000
📡 API available at http://localhost:5000/api
✅ Database connected successfully
```

---

### ✅ Step 2: Is MongoDB Connected?

**Check backend console** for:
- ✅ `MongoDB Connected: ...`
- ❌ `Error connecting to MongoDB`

**If MongoDB is not connected:**

**Option A - Local MongoDB:**
```bash
# Start MongoDB service
mongod
```

**Option B - MongoDB Atlas:**
1. Go to backend directory
2. Check if `.env` file exists
3. Ensure `MONGO_URI` is set correctly:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_secret_key
PORT=5000
```

---

### ✅ Step 3: Do You Have a User Account?

**The most common issue:** Trying to login without registering first!

**Solution:**
1. Go to the Register page: http://localhost:5173/register
2. Create a new account (remember your email and password!)
3. Then try logging in with those credentials

---

### ✅ Step 4: Check Browser Console for Errors

1. Open DevTools (Press F12)
2. Go to **Console** tab
3. Click the Login button
4. Look for error messages

**Common errors:**

- **"Network Error"** → Backend is not running
- **"Invalid email or password"** → Wrong credentials or user doesn't exist
- **CORS error** → Backend CORS misconfiguration

---

### ✅ Step 5: Check Network Request

1. Open DevTools (Press F12)
2. Go to **Network** tab
3. Click the Login button
4. Find the `login` request
5. Check the response

**What to look for:**

**Status 401** - Invalid credentials
```json
{
  "message": "Invalid email or password"
}
```

**Status 500** - Server/database error
```json
{
  "message": "Some error message"
}
```

**Status 200** - Success! (but still showing error?)
```json
{
  "_id": "...",
  "name": "...",
  "email": "...",
  "role": "...",
  "token": "..."
}
```

---

## 🧪 Test the Backend Directly

Run the test script to verify backend is working:

```bash
node test-login.js
```

This will:
1. Check if server is running
2. Test the login endpoint
3. Show you the exact error

---

## 🐛 Common Issues & Solutions

### Issue 1: "Invalid email or password"

**Causes:**
- User doesn't exist in database
- Password is incorrect (case-sensitive!)
- Email typo

**Solutions:**
1. Register a new account first
2. Double-check your email and password
3. Try resetting your password (if feature exists)

---

### Issue 2: Network Error / Cannot connect

**Causes:**
- Backend server is not running
- Wrong API URL
- Firewall blocking connection

**Solutions:**
1. Start backend: `cd backend && npm run dev`
2. Verify API URL in `frontend/.env`: `VITE_API_URL=http://localhost:5000/api`
3. Check if port 5000 is available

---

### Issue 3: Database Connection Failed

**Causes:**
- MongoDB not running
- Wrong connection string
- Network issues (for Atlas)

**Solutions:**

**For local MongoDB:**
```bash
# Start MongoDB
mongod

# Or as a service (Windows)
net start MongoDB
```

**For MongoDB Atlas:**
1. Check your connection string
2. Whitelist your IP address in Atlas
3. Verify username/password are correct

---

### Issue 4: Login Succeeds but Redirects Back

**Causes:**
- Token not being saved
- Auth state not updating
- Navigation issue

**Solutions:**
1. Check browser console for errors
2. Check localStorage for `token` and `user`
3. Clear browser cache and try again

---

## 🔍 Debug Mode

### Enable Detailed Logging

The code already has console.log statements. Check:

**Frontend Console:**
- "Attempting login..."
- "Login successful, navigating to dashboard..."
- "Login error: ..."

**Backend Console:**
- Mongoose debug mode (if enabled)
- Request logs
- Error messages

---

## 📝 Create a Test User Manually

If you want to test with a specific user, run the backend test script:

```bash
cd backend
node testAPI.js
```

This will:
1. Create a test user
2. Test login
3. Test other endpoints

---

## 🆘 Still Not Working?

### Collect This Information:

1. **Backend console output** - Copy any error messages
2. **Browser console errors** - Screenshot or copy errors
3. **Network tab** - Check the login request/response
4. **Environment**:
   - Is backend running? (check http://localhost:5000/api/health)
   - Is MongoDB connected? (check backend console)
   - Did you register a user? (try registering first)

### Check These Files:

1. `backend/.env` - Does it exist? Is MONGO_URI set?
2. `frontend/.env` - Should have `VITE_API_URL=http://localhost:5000/api`
3. Backend console - Any error messages?

---

## 🎯 Quick Test Commands

```bash
# Test if backend is running
curl http://localhost:5000/api/health

# Or in PowerShell
Invoke-WebRequest http://localhost:5000/api/health

# Test login endpoint
node test-login.js

# Run full API tests
cd backend
node testAPI.js
```

---

## ✨ Fresh Start

If nothing works, try a fresh start:

```bash
# 1. Stop all servers (Ctrl+C)

# 2. Clear node_modules and reinstall
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install

# 3. Ensure .env files are correct

# 4. Start MongoDB (if local)
mongod

# 5. Start backend
cd backend
npm run dev

# 6. Start frontend (in new terminal)
cd frontend
npm run dev

# 7. Register a NEW user
# 8. Try logging in with the new credentials
```

---

**Remember:** You MUST register a user before you can login! 🎯
