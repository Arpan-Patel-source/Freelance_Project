@echo off
REM FreelanceHub Test Runner Script for Windows
REM This script runs all tests for the project

echo ╔═══════════════════════════════════════════════════════╗
echo ║     FREELANCEHUB AUTOMATED TEST RUNNER               ║
echo ╚═══════════════════════════════════════════════════════╝
echo.

REM Check if backend is running
echo 🔍 Checking if backend is running...
curl -s http://localhost:5000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is running
) else (
    echo ❌ Backend is not running!
    echo Please start the backend server:
    echo    cd backend ^&^& npm run dev
    exit /b 1
)

REM Check if frontend is running
echo 🔍 Checking if frontend is running...
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend is running
) else (
    echo ⚠️  Frontend is not running
    echo Frontend E2E tests will be skipped
)

echo.
echo ═══════════════════════════════════════════════════════
echo.

REM Run backend API tests
echo 📋 Running Backend API Tests...
echo ═══════════════════════════════════════════════════════
node test-suite.js

set TEST_EXIT_CODE=%errorlevel%

echo.
echo ═══════════════════════════════════════════════════════
echo.

REM Run frontend tests if Playwright is installed
where npx >nul 2>&1
if %errorlevel% equ 0 (
    curl -s http://localhost:5173 >nul 2>&1
    if %errorlevel% equ 0 (
        echo 🎭 Running Frontend E2E Tests...
        echo ═══════════════════════════════════════════════════════
        
        if exist "node_modules\@playwright" (
            npx playwright test frontend-tests.spec.js --reporter=list
        ) else (
            echo ⚠️  Playwright not installed
            echo Install with: npm install -D @playwright/test
            echo Then run: npx playwright install
        )
    )
)

echo.
echo ╔═══════════════════════════════════════════════════════╗
echo ║                 TESTING COMPLETE                      ║
echo ╚═══════════════════════════════════════════════════════╝
echo.

REM Check test results
if %TEST_EXIT_CODE% equ 0 (
    echo ✅ All backend tests passed!
) else (
    echo ❌ Some backend tests failed
)

if exist "test-results.json" (
    echo 📊 Detailed results saved to: test-results.json
)

echo.
exit /b %TEST_EXIT_CODE%
