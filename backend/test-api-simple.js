import http from 'http';

const API_BASE = 'http://localhost:5000';

// Make HTTP request
function makeRequest(path, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test health endpoint
async function testHealth() {
  console.log('\n🔍 Testing Health Check...');
  try {
    const result = await makeRequest('/api/health');
    if (result.status === 200) {
      console.log('✅ Health check passed:', result.data.message);
      return true;
    } else {
      console.log('❌ Health check failed:', result.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Server not reachable:', error.message);
    return false;
  }
}

// Test user registration
async function testRegister() {
  console.log('\n🔍 Testing User Registration...');
  const userData = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    role: 'freelancer'
  };

  try {
    const result = await makeRequest('/api/auth/register', 'POST', userData);
    if (result.status === 201 || result.status === 200) {
      console.log('✅ User registered successfully');
      console.log('   Name:', result.data.user?.name);
      console.log('   Email:', result.data.user?.email);
      console.log('   Role:', result.data.user?.role);
      return { success: true, token: result.data.token, user: result.data.user };
    } else {
      console.log('❌ Registration failed:', result.data.message || result.data);
      return { success: false };
    }
  } catch (error) {
    console.log('❌ Registration error:', error.message);
    return { success: false };
  }
}

// Test get profile
async function testGetProfile(token) {
  console.log('\n🔍 Testing Get Profile...');
  try {
    const result = await makeRequest('/api/auth/me', 'GET', null, token);
    if (result.status === 200) {
      console.log('✅ Profile retrieved successfully');
      console.log('   Name:', result.data.name);
      console.log('   Email:', result.data.email);
      return true;
    } else {
      console.log('❌ Get profile failed:', result.data.message || result.data);
      return false;
    }
  } catch (error) {
    console.log('❌ Get profile error:', error.message);
    return false;
  }
}

// Test get jobs
async function testGetJobs() {
  console.log('\n🔍 Testing Get Jobs...');
  try {
    const result = await makeRequest('/api/jobs');
    if (result.status === 200) {
      const jobs = Array.isArray(result.data) ? result.data : [];
      console.log(`✅ Retrieved ${jobs.length} jobs`);
      return true;
    } else {
      console.log('❌ Get jobs failed:', result.data.message || result.data);
      return false;
    }
  } catch (error) {
    console.log('❌ Get jobs error:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 API Testing Suite - Freelance Platform');
  console.log('='.repeat(60));

  let passed = 0;
  let failed = 0;

  // Test 1: Health Check
  if (await testHealth()) {
    passed++;
  } else {
    failed++;
    console.log('\n⚠️  Server is not running. Please start it with: npm run dev');
    process.exit(1);
  }

  // Test 2: User Registration
  const registerResult = await testRegister();
  if (registerResult.success) {
    passed++;
  } else {
    failed++;
  }

  // Test 3: Get Profile (if registration succeeded)
  if (registerResult.success && registerResult.token) {
    if (await testGetProfile(registerResult.token)) {
      passed++;
    } else {
      failed++;
    }
  }

  // Test 4: Get Jobs
  if (await testGetJobs()) {
    passed++;
  } else {
    failed++;
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${passed}`);
  console.log(`${failed > 0 ? '❌' : '✅'} Failed: ${failed}`);
  console.log('='.repeat(60));

  if (failed === 0) {
    console.log('\n🎉 All tests passed! Your API is working correctly!\n');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.\n');
  }
}

// Run the tests
runTests().catch(console.error);
