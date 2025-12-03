# API Testing Guide

## 🚀 Quick Start

### 1. Start Your Server
```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0.z992nwr.mongodb.net
🚀 Server running in development mode on port 5000
```

### 2. Run the Test Script
Open a new terminal and run:
```bash
cd backend
node test-api-simple.js
```

## 📋 Available API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "freelancer"  // or "client"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User Profile
```http
GET /api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

### Job Routes (`/api/jobs`)

#### Get All Jobs
```http
GET /api/jobs
```

#### Get Single Job
```http
GET /api/jobs/:id
```

#### Create Job (Client only)
```http
POST /api/jobs
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Build a React Website",
  "description": "Need a modern website built with React",
  "category": "Web Development",
  "skills": ["React", "JavaScript", "CSS"],
  "budget": {
    "min": 500,
    "max": 1000
  },
  "budgetType": "fixed",
  "duration": "1-2 weeks",
  "experienceLevel": "intermediate"
}
```

#### Update Job
```http
PUT /api/jobs/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

#### Delete Job
```http
DELETE /api/jobs/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

### Proposal Routes (`/api/proposals`)

#### Get All Proposals
```http
GET /api/proposals
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Create Proposal (Freelancer only)
```http
POST /api/proposals
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "job": "JOB_ID",
  "coverLetter": "I am interested in this project...",
  "bidAmount": 750,
  "deliveryTime": 14
}
```

### Contract Routes (`/api/contracts`)

#### Get All Contracts
```http
GET /api/contracts
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Create Contract
```http
POST /api/contracts
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

### Message Routes (`/api/messages`)

#### Get Conversations
```http
GET /api/messages/conversations
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Send Message
```http
POST /api/messages
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "receiver": "USER_ID",
  "content": "Hello, I'm interested in your project"
}
```

### Review Routes (`/api/reviews`)

#### Get Reviews for User
```http
GET /api/reviews/user/:userId
```

#### Create Review
```http
POST /api/reviews
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "reviewee": "USER_ID",
  "contract": "CONTRACT_ID",
  "rating": 5,
  "comment": "Great work!"
}
```

### Notification Routes (`/api/notifications`)

#### Get User Notifications
```http
GET /api/notifications
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Mark as Read
```http
PUT /api/notifications/:id/read
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🧪 Testing with cURL

### Test Health Check
```bash
curl http://localhost:5000/api/health
```

### Test User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\",\"role\":\"freelancer\"}"
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

## 🔧 Testing with Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Create a new collection called "Freelance Platform API"
3. Add requests for each endpoint
4. Set up environment variables:
   - `base_url`: `http://localhost:5000/api`
   - `token`: (save after login)

## 🌐 Testing with Thunder Client (VS Code Extension)

1. Install Thunder Client extension in VS Code
2. Create a new request
3. Set URL: `http://localhost:5000/api/health`
4. Click "Send"

## 📊 Expected Test Results

When you run `node test-api-simple.js`, you should see:

```
============================================================
🧪 API Testing Suite - Freelance Platform
============================================================

🔍 Testing Health Check...
✅ Health check passed: Server is running

🔍 Testing User Registration...
✅ User registered successfully
   Name: Test User
   Email: test1234567890@example.com
   Role: freelancer

🔍 Testing Get Profile...
✅ Profile retrieved successfully
   Name: Test User
   Email: test1234567890@example.com

🔍 Testing Get Jobs...
✅ Retrieved 0 jobs

============================================================
📊 Test Summary
============================================================
✅ Passed: 4
✅ Failed: 0
============================================================

🎉 All tests passed! Your API is working correctly!
```

## 🐛 Troubleshooting

### Server Not Running
```
❌ Server not reachable: connect ECONNREFUSED
```
**Solution:** Start the server with `npm run dev`

### Database Connection Error
```
❌ Error connecting to MongoDB
```
**Solution:** Check your `.env` file has correct `MONGO_URI`

### Authentication Error
```
❌ Not authorized, token failed
```
**Solution:** Make sure you're sending the JWT token in the Authorization header

## 📝 Next Steps

1. ✅ Run the test script to verify all endpoints
2. 📱 Test with Postman or Thunder Client for more detailed testing
3. 🔍 Check MongoDB Atlas to see the created data
4. 🚀 Start building your frontend to consume these APIs

## 🎯 API Documentation

For complete API documentation, consider setting up Swagger/OpenAPI:
```bash
npm install swagger-ui-express swagger-jsdoc
```

This will provide interactive API documentation at `http://localhost:5000/api-docs`
