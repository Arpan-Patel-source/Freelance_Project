// System check script to diagnose login issues
import fetch from 'node-fetch';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  reset: '\x1b[0m'
};

console.log('\n' + '='.repeat(60));
console.log('🔍 System Diagnostic Check');
console.log('='.repeat(60) + '\n');

async function checkBackend() {
  console.log('1️⃣  Checking Backend Server...');
  try {
    const response = await fetch('http://localhost:5000/api/health', {
      method: 'GET',
      timeout: 5000
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`${colors.green}   ✅ Backend is running${colors.reset}`);
      console.log(`   📡 Status: ${data.status}`);
      console.log(`   💬 Message: ${data.message}\n`);
      return true;
    } else {
      console.log(`${colors.red}   ❌ Backend returned error: ${response.status}${colors.reset}\n`);
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}   ❌ Backend is NOT running${colors.reset}`);
    console.log(`   💡 Error: ${error.message}`);
    console.log(`   🔧 Fix: cd backend && npm run dev\n`);
    return false;
  }
}

async function checkLoginEndpoint() {
  console.log('2️⃣  Checking Login Endpoint...');
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'test' })
    });
    
    const data = await response.json();
    
    if (response.status === 401) {
      console.log(`${colors.green}   ✅ Login endpoint is working${colors.reset}`);
      console.log(`   📝 Response: ${data.message}`);
      console.log(`   💡 This is expected for invalid credentials\n`);
      return true;
    } else if (response.ok) {
      console.log(`${colors.green}   ✅ Login endpoint is working${colors.reset}\n`);
      return true;
    } else {
      console.log(`${colors.yellow}   ⚠️  Unexpected response: ${response.status}${colors.reset}\n`);
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}   ❌ Cannot reach login endpoint${colors.reset}`);
    console.log(`   💡 Error: ${error.message}\n`);
    return false;
  }
}

async function checkEnvironment() {
  console.log('3️⃣  Checking Environment...');
  
  // Check if we're in the right directory
  const fs = await import('fs');
  const path = await import('path');
  
  const backendExists = fs.existsSync('backend');
  const frontendExists = fs.existsSync('frontend');
  
  if (backendExists && frontendExists) {
    console.log(`${colors.green}   ✅ Project structure looks good${colors.reset}`);
    console.log(`   📁 Backend folder: Found`);
    console.log(`   📁 Frontend folder: Found\n`);
  } else {
    console.log(`${colors.yellow}   ⚠️  Project structure issue${colors.reset}`);
    if (!backendExists) console.log(`   ❌ Backend folder not found`);
    if (!frontendExists) console.log(`   ❌ Frontend folder not found`);
    console.log('');
  }
  
  // Check for .env files
  const backendEnv = fs.existsSync('backend/.env');
  const frontendEnv = fs.existsSync('frontend/.env');
  
  console.log('   Environment Files:');
  console.log(`   ${backendEnv ? '✅' : '❌'} backend/.env ${backendEnv ? 'exists' : 'MISSING'}`);
  console.log(`   ${frontendEnv ? '✅' : '❌'} frontend/.env ${frontendEnv ? 'exists' : 'MISSING'}`);
  
  if (!backendEnv) {
    console.log(`\n   ${colors.yellow}⚠️  Create backend/.env with:${colors.reset}`);
    console.log('   MONGO_URI=mongodb://localhost:27017/freelance-platform');
    console.log('   JWT_SECRET=your_secret_key');
    console.log('   PORT=5000');
  }
  
  if (!frontendEnv) {
    console.log(`\n   ${colors.yellow}⚠️  Create frontend/.env with:${colors.reset}`);
    console.log('   VITE_API_URL=http://localhost:5000/api');
  }
  
  console.log('');
}

async function runDiagnostics() {
  const backendOk = await checkBackend();
  
  if (backendOk) {
    await checkLoginEndpoint();
  } else {
    console.log(`${colors.yellow}⏭️  Skipping login endpoint check (backend not running)${colors.reset}\n`);
  }
  
  await checkEnvironment();
  
  console.log('='.repeat(60));
  console.log('📊 Summary');
  console.log('='.repeat(60));
  
  if (backendOk) {
    console.log(`${colors.green}✅ Backend is running and reachable${colors.reset}`);
    console.log(`${colors.green}✅ You can now try logging in${colors.reset}`);
    console.log('\n💡 If login still fails:');
    console.log('   1. Make sure you have registered a user first');
    console.log('   2. Check browser console (F12) for detailed errors');
    console.log('   3. Verify your email and password are correct');
  } else {
    console.log(`${colors.red}❌ Backend is not running${colors.reset}`);
    console.log('\n🔧 To fix:');
    console.log('   1. Open a terminal');
    console.log('   2. Run: cd backend');
    console.log('   3. Run: npm run dev');
    console.log('   4. Wait for "Database connected successfully"');
    console.log('   5. Then try logging in again');
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
}

runDiagnostics().catch(console.error);
