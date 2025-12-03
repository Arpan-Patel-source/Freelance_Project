import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  reset: '\x1b[0m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`)
};

// Test data
const testUser = {
  name: 'Test Freelancer',
  email: `test${Date.now()}@example.com`,
  password: 'password123',
  role: 'freelancer'
};

let authToken = '';
let userId = '';

// Test functions
async function testHealthCheck() {
  try {
    log.info('Testing health check endpoint...');
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();
    
    if (response.ok) {
      log.success(`Health check passed: ${data.message}`);
      return true;
    } else {
      log.error('Health check failed');
      return false;
    }
  } catch (error) {
    log.error(`Health check error: ${error.message}`);
    return false;
  }
}

async function testUserRegistration() {
  try {
    log.info('Testing user registration...');
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      authToken = data.token;
      userId = data.user._id;
      log.success(`User registered: ${data.user.name} (${data.user.email})`);
      log.info(`User ID: ${userId}`);
      return true;
    } else {
      log.error(`Registration failed: ${data.message || 'Unknown error'}`);
      console.log('Response:', data);
      return false;
    }
  } catch (error) {
    log.error(`Registration error: ${error.message}`);
    return false;
  }
}

async function testUserLogin() {
  try {
    log.info('Testing user login...');
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      log.success(`Login successful: ${data.user.name}`);
      return true;
    } else {
      log.error(`Login failed: ${data.message || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    log.error(`Login error: ${error.message}`);
    return false;
  }
}

async function testGetProfile() {
  try {
    log.info('Testing get profile...');
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: { 
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      log.success(`Profile retrieved: ${data.name} (${data.role})`);
      return true;
    } else {
      log.error(`Get profile failed: ${data.message || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    log.error(`Get profile error: ${error.message}`);
    return false;
  }
}

async function testCreateJob() {
  try {
    log.info('Testing job creation...');
    const jobData = {
      title: 'Test Web Development Project',
      description: 'This is a test job posting to verify API functionality',
      category: 'Web Development',
      skills: ['JavaScript', 'React', 'Node.js'],
      budget: { min: 500, max: 1000 },
      budgetType: 'fixed',
      duration: '1-2 weeks',
      experienceLevel: 'intermediate'
    };
    
    const response = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(jobData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      log.success(`Job created: ${data.title}`);
      return true;
    } else {
      log.error(`Job creation failed: ${data.message || 'Unknown error'}`);
      console.log('Response:', data);
      return false;
    }
  } catch (error) {
    log.error(`Job creation error: ${error.message}`);
    return false;
  }
}

async function testGetJobs() {
  try {
    log.info('Testing get all jobs...');
    const response = await fetch(`${API_BASE}/jobs`);
    const data = await response.json();
    
    if (response.ok) {
      log.success(`Retrieved ${data.length || 0} jobs`);
      return true;
    } else {
      log.error(`Get jobs failed: ${data.message || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    log.error(`Get jobs error: ${error.message}`);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('\n' + '='.repeat(50));
  console.log('🧪 API Testing Suite');
  console.log('='.repeat(50) + '\n');
  
  let passed = 0;
  let failed = 0;
  
  // Test 1: Health Check
  if (await testHealthCheck()) passed++; else failed++;
  console.log('');
  
  // Test 2: User Registration
  if (await testUserRegistration()) passed++; else failed++;
  console.log('');
  
  // Test 3: User Login
  if (await testUserLogin()) passed++; else failed++;
  console.log('');
  
  // Test 4: Get Profile
  if (await testGetProfile()) passed++; else failed++;
  console.log('');
  
  // Test 5: Create Job
  if (await testCreateJob()) passed++; else failed++;
  console.log('');
  
  // Test 6: Get Jobs
  if (await testGetJobs()) passed++; else failed++;
  console.log('');
  
  // Summary
  console.log('='.repeat(50));
  console.log('📊 Test Results');
  console.log('='.repeat(50));
  log.success(`Passed: ${passed}`);
  if (failed > 0) log.error(`Failed: ${failed}`);
  console.log('='.repeat(50) + '\n');
  
  if (failed === 0) {
    log.success('All tests passed! 🎉');
  } else {
    log.warning('Some tests failed. Check the errors above.');
  }
}

// Check if server is running
async function checkServer() {
  try {
    await fetch(`${API_BASE}/health`);
    return true;
  } catch (error) {
    return false;
  }
}

// Main
(async () => {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    log.error('Server is not running!');
    log.info('Please start the server first:');
    console.log('  cd backend');
    console.log('  npm run dev\n');
    process.exit(1);
  }
  
  await runTests();
})();
