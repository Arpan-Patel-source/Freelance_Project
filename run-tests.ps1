# FreelanceHub Test Runner Script for PowerShell
# This script runs all tests for the project

Write-Host "╔═══════════════════════════════════════════════════════╗" -ForegroundColor Blue
Write-Host "║     FREELANCEHUB AUTOMATED TEST RUNNER               ║" -ForegroundColor Blue
Write-Host "╚═══════════════════════════════════════════════════════╝" -ForegroundColor Blue
Write-Host ""

# Check if backend is running
Write-Host "🔍 Checking if backend is running..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Backend is running" -ForegroundColor Green
    $backendRunning = $true
} catch {
    Write-Host "❌ Backend is not running!" -ForegroundColor Red
    Write-Host "Please start the backend server:" -ForegroundColor Yellow
    Write-Host "   cd backend" -ForegroundColor Yellow
    Write-Host "   npm run dev" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# Check if frontend is running
Write-Host "🔍 Checking if frontend is running..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Frontend is running" -ForegroundColor Green
    $frontendRunning = $true
} catch {
    Write-Host "⚠️  Frontend is not running" -ForegroundColor Yellow
    Write-Host "Frontend E2E tests will be skipped" -ForegroundColor Yellow
    $frontendRunning = $false
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host ""

# Run backend API tests
Write-Host "📋 Running Backend API Tests..." -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Blue

node test-suite.js

$testExitCode = $LASTEXITCODE

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host ""

# Run frontend tests if Playwright is installed and frontend is running
if ($frontendRunning) {
    if (Test-Path "node_modules\@playwright") {
        Write-Host "🎭 Running Frontend E2E Tests..." -ForegroundColor Cyan
        Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Blue
        
        npx playwright test frontend-tests.spec.js --reporter=list
    } else {
        Write-Host "⚠️  Playwright not installed" -ForegroundColor Yellow
        Write-Host "Install with: npm install -D @playwright/test" -ForegroundColor Yellow
        Write-Host "Then run: npx playwright install" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════╗" -ForegroundColor Blue
Write-Host "║                 TESTING COMPLETE                      ║" -ForegroundColor Blue
Write-Host "╚═══════════════════════════════════════════════════════╝" -ForegroundColor Blue
Write-Host ""

# Check test results
if ($testExitCode -eq 0) {
    Write-Host "✅ All backend tests passed!" -ForegroundColor Green
} else {
    Write-Host "❌ Some backend tests failed" -ForegroundColor Red
}

if (Test-Path "test-results.json") {
    Write-Host "📊 Detailed results saved to: test-results.json" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

exit $testExitCode
