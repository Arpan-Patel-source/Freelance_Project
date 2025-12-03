#!/bin/bash

# FreelanceHub Test Runner Script
# This script runs all tests for the project

echo "╔═══════════════════════════════════════════════════════╗"
echo "║     FREELANCEHUB AUTOMATED TEST RUNNER               ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if backend is running
echo -e "${BLUE}🔍 Checking if backend is running...${NC}"
if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${RED}❌ Backend is not running!${NC}"
    echo -e "${YELLOW}Please start the backend server:${NC}"
    echo "   cd backend && npm run dev"
    exit 1
fi

# Check if frontend is running
echo -e "${BLUE}🔍 Checking if frontend is running...${NC}"
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is running${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend is not running${NC}"
    echo -e "${YELLOW}Frontend E2E tests will be skipped${NC}"
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo ""

# Run backend API tests
echo -e "${BLUE}📋 Running Backend API Tests...${NC}"
echo "═══════════════════════════════════════════════════════"
node test-suite.js

TEST_EXIT_CODE=$?

echo ""
echo "═══════════════════════════════════════════════════════"
echo ""

# Run frontend tests if Playwright is installed
if command -v npx &> /dev/null; then
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo -e "${BLUE}🎭 Running Frontend E2E Tests...${NC}"
        echo "═══════════════════════════════════════════════════════"
        
        # Check if Playwright is installed
        if [ -d "node_modules/@playwright" ]; then
            npx playwright test frontend-tests.spec.js --reporter=list
            FRONTEND_EXIT_CODE=$?
        else
            echo -e "${YELLOW}⚠️  Playwright not installed${NC}"
            echo "Install with: npm install -D @playwright/test"
            echo "Then run: npx playwright install"
        fi
    fi
fi

echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║                 TESTING COMPLETE                      ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Check test results
if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ All backend tests passed!${NC}"
else
    echo -e "${RED}❌ Some backend tests failed${NC}"
fi

if [ -f "test-results.json" ]; then
    echo -e "${BLUE}📊 Detailed results saved to: test-results.json${NC}"
fi

echo ""
exit $TEST_EXIT_CODE
