import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

async function testLogin() {
  console.log('Testing login functionality...\n');
  
  // First check if server is running
  try {
    console.log('1. Checking if server is running...');
    const healthCheck = await fetch(`${API_BASE}/health`);
    if (healthCheck.ok) {
      console.log('✅ Server is running\n');
    }
  } catch (error) {
    console.log('❌ Server is NOT running!');
    console.log('Please start the backend server first:');
    console.log('  cd backend');
    console.log('  npm run dev\n');
    process.exit(1);
  }
  
  // Test with a sample login
  console.log('2. Testing login endpoint...');
  console.log('Enter your test credentials:');
  console.log('Email: test@example.com');
  console.log('Password: password123\n');
  
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    const data = await response.json();
    
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Login successful!');
    } else {
      console.log('\n❌ Login failed:', data.message);
      console.log('\nPossible reasons:');
      console.log('1. User does not exist in database');
      console.log('2. Incorrect password');
      console.log('3. Database connection issue');
      console.log('\nTry registering a user first or check your credentials.');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testLogin();
