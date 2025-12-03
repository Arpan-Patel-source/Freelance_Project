# TestSprite Testing Guide for FreelanceHub

This guide will help you test the entire FreelanceHub project using TestSprite.

## Prerequisites

1. **TestSprite MCP Server** must be installed and configured in your IDE
   - Install: `npm install -g @testsprite/testsprite-mcp`
   - Configure in your IDE's MCP settings (Cursor, VS Code, etc.)

2. **MongoDB** must be running
   - Local: `mongod`
   - Or use MongoDB Atlas connection

3. **Node.js** and **npm** installed

## Step 1: Start the Applications

### Terminal 1 - Backend Server
```bash
cd backend
npm install  # if not already installed
npm run dev
```
Backend should be running on: **http://localhost:5000**

### Terminal 2 - Frontend Server
```bash
cd frontend
npm install  # if not already installed
npm run dev
```
Frontend should be running on: **http://localhost:5173**

## Step 2: Setup Test Users

In a new terminal, run:
```bash
node setup-test-users.js
```

This will create two test accounts:
- **Client**: testclient@example.com / TestClient123!
- **Freelancer**: testfreelancer@example.com / TestFreelancer123!

## Step 3: Initiate TestSprite Testing

### Option A: Using IDE Chat (Recommended)

1. Open a new chat window in your IDE (Cursor, VS Code with Copilot, etc.)
2. Type the following command:

```
Can you test this project with TestSprite?
```

3. When prompted, provide the following configuration:

**Testing Type:**
- Mode: Both Frontend and Backend
- Scope: Full application testing

**Test Credentials:**
```
Client Account:
  Email: testclient@example.com
  Password: TestClient123!

Freelancer Account:
  Email: testfreelancer@example.com
  Password: TestFreelancer123!
```

**Application URLs:**
```
Frontend: http://localhost:5173
Backend: http://localhost:5000
```

**Product Requirements Document:**
- Upload or reference: `testsprite_prd.md`

### Option B: Using TestSprite Configuration File

If your IDE supports it, you can reference the configuration file:
```
Please test this project using the configuration in testsprite_config.json
```

## Step 4: TestSprite Automated Workflow

TestSprite will automatically:

1. **Read the PRD** - Analyze testsprite_prd.md
2. **Analyze Code** - Scan frontend and backend code
3. **Generate Test Plan** - Create comprehensive test scenarios
4. **Generate Test Code** - Write automated tests (Playwright for frontend, API tests for backend)
5. **Execute Tests** - Run all generated tests
6. **Provide Results** - Generate detailed test report
7. **Suggest Fixes** - Identify bugs and suggest solutions

## Step 5: Review Test Results

TestSprite will create a `testsprite_tests/` directory with:

```
testsprite_tests/
├── tmp/
│   ├── config.json              # Test configuration
│   ├── code_summary.json        # Code analysis
│   ├── test_results.json        # Detailed results
│   └── report_prompt.json       # AI analysis
├── standard_prd.json            # Normalized PRD
├── TestSprite_MCP_Test_Report.md   # Markdown report
├── TestSprite_MCP_Test_Report.html # HTML report
├── TC001_User_Registration_Client.py
├── TC002_User_Login_Success.py
├── TC003_Job_Posting_Flow.py
├── TC004_Proposal_Submission.py
├── TC005_Contract_Creation.py
├── TC006_Real_Time_Messaging.py
└── ... (additional test files)
```

### Key Files to Review:

1. **TestSprite_MCP_Test_Report.html** - Open in browser for visual report
2. **TestSprite_MCP_Test_Report.md** - Markdown summary of all tests
3. **test_results.json** - Detailed JSON results

## Step 6: Fix Issues (If Any)

If TestSprite finds bugs, you can ask it to fix them:

```
Please fix the codebase based on TestSprite testing results.
```

TestSprite will automatically:
- Identify the root cause
- Generate fixes
- Apply patches to your code
- Re-run tests to verify fixes

## What TestSprite Will Test

### Frontend Tests (E2E with Playwright)
- ✅ User registration (both roles)
- ✅ User login (email + Google OAuth)
- ✅ Job posting and management
- ✅ Job browsing and filtering
- ✅ Proposal submission
- ✅ Proposal acceptance/rejection
- ✅ Contract management
- ✅ Real-time messaging
- ✅ Notifications
- ✅ Reviews and ratings
- ✅ Dashboard functionality
- ✅ Navigation and routing
- ✅ Form validation
- ✅ Error handling
- ✅ Responsive design

### Backend Tests (API Integration)
- ✅ Authentication endpoints
- ✅ Authorization middleware
- ✅ Job CRUD operations
- ✅ Proposal operations
- ✅ Contract operations
- ✅ Message operations
- ✅ Review operations
- ✅ Notification operations
- ✅ Input validation
- ✅ Error responses
- ✅ Database operations
- ✅ Socket.io connections

### Security Tests
- ✅ JWT token validation
- ✅ Role-based access control
- ✅ Protected routes
- ✅ Input sanitization
- ✅ CORS configuration
- ✅ Password hashing

### Performance Tests
- ✅ API response times
- ✅ Database query performance
- ✅ Real-time message latency
- ✅ Concurrent user handling

## Expected Test Coverage

- **Frontend**: 90%+ component and user flow coverage
- **Backend**: 95%+ API endpoint coverage
- **Integration**: 85%+ end-to-end flow coverage
- **Security**: 100% critical security checks

## Troubleshooting

### TestSprite Not Found
- Ensure TestSprite MCP server is installed: `npm install -g @testsprite/testsprite-mcp`
- Check IDE MCP configuration
- Restart IDE after installation

### Applications Not Running
- Verify backend is on http://localhost:5000
- Verify frontend is on http://localhost:5173
- Check for port conflicts
- Review console logs for errors

### Test Users Not Created
- Ensure backend is running
- Check MongoDB connection
- Verify API endpoint: http://localhost:5000/api/auth/register
- Run setup script again: `node setup-test-users.js`

### Database Connection Issues
- Check MongoDB is running
- Verify MONGO_URI in backend/.env
- Test connection: `node backend/testDB.js`

### Authentication Failures
- Verify JWT_SECRET is set in backend/.env
- Check token expiration settings
- Clear browser localStorage/cookies
- Verify test user credentials

## Additional Commands

### Manual Test Execution
If you want to run specific tests manually:
```bash
cd testsprite_tests
python TC001_User_Registration_Client.py
```

### View Test Report
```bash
# Open HTML report in browser
start TestSprite_MCP_Test_Report.html  # Windows
open TestSprite_MCP_Test_Report.html   # macOS
xdg-open TestSprite_MCP_Test_Report.html  # Linux
```

### Re-run Tests
To re-run tests after fixes:
```
Please rerun the TestSprite tests
```

### Add More Tests
To add additional test scenarios:
```
Please add tests for [specific feature] using TestSprite
```

### Update Tests
To modify existing tests:
```
Please update the TestSprite tests to include [new scenario]
```

## Best Practices

1. **Keep applications running** during testing
2. **Use clean test data** - Fresh database or dedicated test database
3. **Review PRD** before testing to ensure completeness
4. **Monitor console logs** during test execution
5. **Fix critical issues first** before re-running tests
6. **Maintain test users** - Don't delete test accounts
7. **Document custom scenarios** in PRD for specific tests

## Support

- **TestSprite Documentation**: https://docs.testsprite.com
- **TestSprite Discord**: https://discord.gg/QQB9tJ973e
- **GitHub Issues**: For project-specific issues

## Next Steps After Testing

1. Review all test results
2. Fix identified bugs
3. Re-run tests to verify fixes
4. Add tests to CI/CD pipeline
5. Deploy with confidence

---

**Note**: TestSprite uses AI to generate and execute tests. The first run may take 5-10 minutes depending on project size. Subsequent runs will be faster as TestSprite learns your codebase.
