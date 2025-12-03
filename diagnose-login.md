# Login Issue Diagnosis

## Common Causes of "Login Failed" Error

Based on your code analysis, here are the most likely causes:

### 1. **Backend Server Not Running** ⚠️
The most common issue - the backend server at `http://localhost:5000` is not running.

**Solution:**
```bash
cd backend
npm run dev
```

### 2. **User Does Not Exist in Database** 
You're trying to login with credentials that don't exist in the database.

**Solution:**
- First register a new user at `/register` page
- Or use existing credentials if you've already registered

### 3. **Database Connection Issue**
MongoDB is not connected or `.env` file is missing/misconfigured.

**Check:**
- Ensure MongoDB is running (local or Atlas)
- Verify `.env` file exists in `backend/` directory with:
  ```env
  MONGO_URI=mongodb://localhost:27017/freelance-platform
  # OR for MongoDB Atlas:
  # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
  JWT_SECRET=your_secret_key_here
  PORT=5000
  ```

### 4. **Incorrect Password**
The password you're entering doesn't match the hashed password in database.

**Note:** Passwords are case-sensitive and must match exactly.

### 5. **CORS or Network Issue**
Frontend cannot reach the backend API.

**Check:**
- Frontend is trying to connect to: `http://localhost:5000/api`
- Backend CORS is configured to allow requests from: `http://localhost:5173`

### 6. **Frontend Environment Variable**
Missing or incorrect `VITE_API_URL` in frontend.

**Solution:**
Create `frontend/.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

## Quick Diagnostic Steps

1. **Check if backend is running:**
   - Open browser: http://localhost:5000/api/health
   - Should return: `{"status":"OK","message":"Server is running"}`

2. **Check browser console:**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for error messages when clicking login

3. **Check Network tab:**
   - Open DevTools (F12)
   - Go to Network tab
   - Click login button
   - Check the `/auth/login` request
   - Look at the response status and data

## Test Login Endpoint

Run this command to test the login endpoint directly:
```bash
node test-login.js
```

## Create a Test User

If you need to create a test user, you can:

1. Use the Register page in the UI
2. Or run the test API script:
```bash
cd backend
node testAPI.js
```

## Error Messages Explained

- **"Invalid email or password"** - User doesn't exist or password is wrong
- **"Login failed"** - Generic error, check backend logs
- **Network Error** - Backend server is not running or unreachable
- **401 Unauthorized** - Authentication failed
- **500 Internal Server Error** - Backend/database issue

## Next Steps

1. Start the backend server if not running
2. Check backend console for any error messages
3. Try registering a new user first
4. Check browser console for detailed error messages
