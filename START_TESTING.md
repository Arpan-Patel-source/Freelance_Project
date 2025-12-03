# 🚀 Start Testing FreelanceHub

Quick guide to run comprehensive tests on your FreelanceHub project.

## ⚡ Quick Start (3 Steps)

### Step 1: Check Server Status
```bash
node check-servers.js
```

This will tell you if backend and frontend are running.

### Step 2: Start Servers (if not running)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Wait for: `✅ Database connected successfully`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Wait for: `Local: http://localhost:5173/`

### Step 3: Run Tests

**Option A - PowerShell (Recommended for Windows):**
```powershell
.\run-tests.ps1
```

**Option B - Command Prompt:**
```cmd
run-tests.bat
```

**Option C - Direct Node.js:**
```bash
node test-suite.js
```

## 📊 What Gets Tested

### ✅ Backend API Tests (32 tests)
- Authentication (7 tests)
- Job Management (6 tests)
- Proposals (5 tests)
- Contracts (4 tests)
- Messages (4 tests)
- Reviews (2 tests)
- Notifications (2 tests)
- Real-time Socket.io (1 test)
- Health Check (1 test)

### ✅ Security Tests
- JWT token validation
- Role-based access control
- Unauthorized access prevention
- Invalid credentials rejection

### ✅ Integration Tests
- Complete user flows
- Client → Job → Proposal → Contract flow
- Freelancer → Browse → Apply → Work flow
- Real-time messaging

## 📋 Test Results

After running tests, you'll see:

```
╔═══════════════════════════════════════════════════════╗
║                   TEST SUMMARY                        ║
╚═══════════════════════════════════════════════════════╝

📊 Total Tests: 32
✅ Passed: 30
❌ Failed: 2
⏱️  Duration: 5.23s
📈 Success Rate: 93.75%
```

Results are also saved to `test-results.json` for detailed analysis.

## 🎯 Expected Results

All tests should pass if:
- ✅ Backend is running on port 5000
- ✅ Frontend is running on port 5173
- ✅ MongoDB is connected
- ✅ All environment variables are set

## ❌ If Tests Fail

### Common Issues:

**1. Server Not Running**
```
❌ Backend is not running!
```
**Fix:** Start backend with `cd backend && npm run dev`

**2. Database Connection Error**
```
MongooseServerSelectionError
```
**Fix:** 
- Start MongoDB: `mongod`
- Or check MongoDB Atlas connection in `backend/.env`

**3. Port Already in Use**
```
EADDRINUSE: address already in use
```
**Fix:** 
- Kill process on port 5000: `npx kill-port 5000`
- Or change PORT in `backend/.env`

**4. Missing Dependencies**
```
Cannot find module 'axios'
```
**Fix:** 
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

## 📁 Test Files

| File | Purpose |
|------|---------|
| `test-suite.js` | Main backend API test suite |
| `frontend-tests.spec.js` | Frontend E2E tests (Playwright) |
| `check-servers.js` | Check if servers are running |
| `setup-test-users.js` | Create test user accounts |
| `run-tests.ps1` | PowerShell test runner |
| `run-tests.bat` | Batch test runner |
| `run-tests.sh` | Bash test runner (Linux/Mac) |

## 🔧 Advanced Options

### Run Specific Test Categories

Edit `test-suite.js` and comment out tests you don't want:

```javascript
async function runAllTests() {
  await testHealthCheck();
  await testAuthentication();
  // await testJobManagement();  // Skip this
  await testMessages();
}
```

### View Detailed Results

```bash
# View JSON results
cat test-results.json

# Or open in browser (if you have jq)
cat test-results.json | jq
```

### Clean Test Data

If you want to start fresh:
```bash
# Delete test users from database
# (You'll need to implement this or do it manually via MongoDB)
```

## 📖 Full Documentation

For complete testing documentation, see:
- `TESTING_GUIDE.md` - Comprehensive testing guide
- `TESTSPRITE_GUIDE.md` - TestSprite integration guide (optional)

## 🎓 Understanding Test Output

### ✅ Green Checkmark
Test passed successfully

### ❌ Red X
Test failed - check error message

### Example Output:
```
🔐 AUTHENTICATION TESTS
═══════════════════════════════════════
✅ Register client user
✅ Register freelancer user
✅ Login client user
✅ Login freelancer user
✅ Reject invalid credentials
✅ Get authenticated user profile
✅ Reject unauthorized access
```

## 🚨 Troubleshooting

### Tests Hang or Timeout
- Increase timeout in test files
- Check server response times
- Verify database connection

### "Module not found" Errors
```bash
npm install
```

### Permission Denied (Linux/Mac)
```bash
chmod +x run-tests.sh
./run-tests.sh
```

### Windows PowerShell Execution Policy
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\run-tests.ps1
```

## 💡 Tips

1. **Run tests before deploying** to catch bugs early
2. **Check test results** in `test-results.json` for details
3. **Keep servers running** during test execution
4. **Use clean test data** for consistent results
5. **Review failed tests** immediately to fix issues

## 🎉 Success!

If all tests pass, you'll see:
```
✅ All backend tests passed!
📊 Detailed results saved to: test-results.json
```

Your FreelanceHub application is working correctly! 🎊

---

**Need Help?**
- Check `TESTING_GUIDE.md` for detailed documentation
- Review server logs for errors
- Ensure all prerequisites are met
