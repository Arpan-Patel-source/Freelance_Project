# FreelanceHub Testing Guide

Complete guide for testing the FreelanceHub platform with automated test suites.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Test Suites](#test-suites)
5. [Running Tests](#running-tests)
6. [Test Coverage](#test-coverage)
7. [Troubleshooting](#troubleshooting)

## Overview

This project includes comprehensive automated testing covering:
- ✅ Backend API endpoints
- ✅ Authentication & Authorization
- ✅ Database operations
- ✅ Real-time messaging (Socket.io)
- ✅ Frontend E2E tests (optional with Playwright)
- ✅ Security & validation
- ✅ Error handling

## Prerequisites

### Required
- Node.js (v16+)
- MongoDB (running)
- Backend server running on http://localhost:5000
- Frontend server running on http://localhost:5173

### Optional (for E2E tests)
- Playwright Test Framework

## Quick Start

### 1. Start the Applications

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### 2. Run Tests

**Windows:**
```bash
run-tests.bat
```

**Linux/Mac:**
```bash
chmod +x run-tests.sh
./run-tests.sh
```

**Or directly:**
```bash
node test-suite.js
```

## Test Suites

### 1. Backend API Tests (`test-suite.js`)

Comprehensive backend testing covering all API endpoints.

#### Test Categories:

**Health Check (1 test)**
- Server availability

**Authentication (7 tests)**
- ✅ Client registration
- ✅ Freelancer registration
- ✅ Client login
- ✅ Freelancer login
- ✅ Invalid credentials rejection
- ✅ Get authenticated user
- ✅ Unauthorized access rejection

**Job Management (6 tests)**
- ✅ Client creates job
- ✅ Freelancer cannot create job
- ✅ Get all jobs
- ✅ Get single job
- ✅ Update job
- ✅ Search jobs

**Proposals (5 tests)**
- ✅ Freelancer submits proposal
- ✅ Client cannot submit proposal
- ✅ Get job proposals (client)
- ✅ Get freelancer proposals
- ✅ Accept proposal

**Contracts (4 tests)**
- ✅ Get user contracts
- ✅ Get contract details
- ✅ Add milestone
- ✅ Submit deliverable

**Messages (4 tests)**
- ✅ Send message
- ✅ Get conversations
- ✅ Get conversation with user
- ✅ Mark messages as read

**Reviews (2 tests)**
- ✅ Submit review
- ✅ Get user reviews

**Notifications (2 tests)**
- ✅ Get notifications
- ✅ Mark all as read

**Real-time (1 test)**
- ✅ Socket.io connection

**Total: 32 Backend Tests**

### 2. Frontend E2E Tests (`frontend-tests.spec.js`)

End-to-end testing using Playwright (optional).

#### Test Categories:

**Authentication Flow (6 tests)**
- Homepage load
- Navigate to register
- Register client
- Register freelancer
- Login
- Logout

**Job Management (4 tests)**
- Navigate to post job
- Create job
- View posted jobs
- Edit job

**Job Browsing (4 tests)**
- Browse jobs
- View job details
- Search jobs
- Filter jobs

**Proposal Submission (2 tests)**
- Submit proposal
- View proposals

**Messaging (2 tests)**
- Navigate to messages
- Send message

**Dashboard (2 tests)**
- Client dashboard
- Freelancer dashboard

**Navigation (1 test)**
- Navigate between pages

**Responsive Design (2 tests)**
- Mobile viewport
- Tablet viewport

**Form Validation (2 tests)**
- Registration validation
- Email format validation

**Total: 25 Frontend Tests**

## Running Tests

### Backend Tests Only

```bash
node test-suite.js
```

### Frontend Tests Only (requires Playwright)

First, install Playwright:
```bash
npm install -D @playwright/test
npx playwright install
```

Then run:
```bash
npx playwright test frontend-tests.spec.js
```

### All Tests

```bash
# Windows
run-tests.bat

# Linux/Mac
./run-tests.sh
```

### Specific Test Categories

You can modify `test-suite.js` to run specific categories:

```javascript
// Comment out tests you don't want to run
async function runAllTests() {
  await testHealthCheck();
  await testAuthentication();
  // await testJobManagement();  // Skip this
  // await testProposals();       // Skip this
  await testMessages();
}
```

## Test Output

### Console Output

Tests provide real-time colored console output:
- ✅ Green checkmark = Test passed
- ❌ Red X = Test failed
- 📊 Summary statistics at the end

### JSON Report

Results are saved to `test-results.json`:

```json
{
  "total": 32,
  "passed": 30,
  "failed": 2,
  "tests": [
    {
      "name": "Server health check",
      "status": "PASS",
      "message": ""
    }
  ],
  "duration": "5.23",
  "timestamp": "2024-11-06T18:00:00.000Z"
}
```

### Playwright Report

For E2E tests:
```bash
npx playwright show-report
```

## Test Coverage

### API Endpoints Tested

| Endpoint | Method | Tested |
|----------|--------|--------|
| `/api/health` | GET | ✅ |
| `/api/auth/register` | POST | ✅ |
| `/api/auth/login` | POST | ✅ |
| `/api/auth/me` | GET | ✅ |
| `/api/jobs` | GET | ✅ |
| `/api/jobs` | POST | ✅ |
| `/api/jobs/:id` | GET | ✅ |
| `/api/jobs/:id` | PUT | ✅ |
| `/api/proposals` | POST | ✅ |
| `/api/proposals/job/:jobId` | GET | ✅ |
| `/api/proposals/my-proposals` | GET | ✅ |
| `/api/proposals/:id/accept` | PUT | ✅ |
| `/api/contracts` | GET | ✅ |
| `/api/contracts/:id` | GET | ✅ |
| `/api/contracts/:id/milestones` | POST | ✅ |
| `/api/contracts/:id/deliverables` | POST | ✅ |
| `/api/messages` | POST | ✅ |
| `/api/messages/conversations` | GET | ✅ |
| `/api/messages/:userId` | GET | ✅ |
| `/api/messages/:userId/read` | PUT | ✅ |
| `/api/reviews` | POST | ✅ |
| `/api/reviews/user/:userId` | GET | ✅ |
| `/api/notifications` | GET | ✅ |
| `/api/notifications/read-all` | PUT | ✅ |

### Features Tested

- ✅ User Registration (both roles)
- ✅ User Authentication (JWT)
- ✅ Role-based Access Control
- ✅ Job CRUD Operations
- ✅ Proposal Submission & Management
- ✅ Contract Creation & Management
- ✅ Real-time Messaging
- ✅ Reviews & Ratings
- ✅ Notifications
- ✅ Input Validation
- ✅ Error Handling
- ✅ Unauthorized Access Prevention
- ✅ Socket.io Connections

### Security Tests

- ✅ JWT token validation
- ✅ Protected route access
- ✅ Role-based permissions
- ✅ Invalid credentials rejection
- ✅ Unauthorized request blocking

## Troubleshooting

### Backend Not Running

**Error:** `ECONNREFUSED` or connection errors

**Solution:**
```bash
cd backend
npm run dev
```

Verify: http://localhost:5000/api/health

### Frontend Not Running

**Error:** Cannot connect to frontend

**Solution:**
```bash
cd frontend
npm run dev
```

Verify: http://localhost:5173

### MongoDB Connection Error

**Error:** `MongooseServerSelectionError`

**Solution:**
1. Start MongoDB:
   ```bash
   mongod
   ```
2. Or use MongoDB Atlas (check `.env` file)
3. Verify connection string in `backend/.env`

### Test Users Already Exist

**Error:** Email already exists

**Solution:**
This is normal! Tests will handle existing users. Or clear the database:
```bash
cd backend
node testDB.js
```

### Socket.io Connection Failed

**Error:** Socket connection timeout

**Solution:**
1. Ensure backend is running
2. Check CORS settings in `backend/server.js`
3. Verify Socket.io server is initialized

### Playwright Not Installed

**Error:** `@playwright/test` not found

**Solution:**
```bash
npm install -D @playwright/test
npx playwright install
```

### Tests Timing Out

**Solution:**
1. Increase timeout in test files
2. Check server response times
3. Verify database connection speed

### Permission Denied (Linux/Mac)

**Error:** Cannot execute `run-tests.sh`

**Solution:**
```bash
chmod +x run-tests.sh
```

## Advanced Usage

### Custom Test Configuration

Create a `.env.test` file:
```env
API_URL=http://localhost:5000/api
FRONTEND_URL=http://localhost:5173
TEST_TIMEOUT=10000
```

### Continuous Integration

Add to your CI/CD pipeline:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Start MongoDB
        uses: supercharge/mongodb-github-action@1.8.0
      - name: Run tests
        run: node test-suite.js
```

### Parallel Testing

Run tests in parallel (requires test framework):
```bash
npx playwright test --workers=4
```

### Test Data Cleanup

After testing, clean up test data:
```javascript
// cleanup.js
import mongoose from 'mongoose';
import User from './backend/models/User.js';

await mongoose.connect(process.env.MONGO_URI);
await User.deleteMany({ email: /test.*@example\.com/ });
```

## Best Practices

1. **Always run tests before deployment**
2. **Keep test data separate from production**
3. **Run tests in a clean environment**
4. **Review failed tests immediately**
5. **Update tests when adding features**
6. **Use meaningful test names**
7. **Test edge cases and error scenarios**

## Test Maintenance

### Adding New Tests

1. Add test function to `test-suite.js`:
```javascript
async function testNewFeature() {
  log('\n🆕 NEW FEATURE TESTS', 'cyan');
  
  await runTest('Test description', async () => {
    // Test code here
  });
}
```

2. Call in `runAllTests()`:
```javascript
await testNewFeature();
```

### Updating Existing Tests

When API changes, update corresponding tests:
1. Locate test in `test-suite.js`
2. Update request/response expectations
3. Run tests to verify

## Support

For issues or questions:
1. Check troubleshooting section
2. Review test output and error messages
3. Check server logs
4. Verify all prerequisites are met

---

**Happy Testing! 🎉**
