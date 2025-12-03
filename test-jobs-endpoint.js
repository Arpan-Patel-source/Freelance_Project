// Simple script to test the jobs endpoint
const API_URL = 'http://localhost:5000/api';

async function testJobsEndpoint() {
  try {
    console.log('Testing GET /api/jobs endpoint...\n');
    
    const response = await fetch(`${API_URL}/jobs`);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return;
    }
    
    const jobs = await response.json();
    console.log(`\nSuccess! Found ${jobs.length} jobs`);
    
    if (jobs.length > 0) {
      console.log('\nFirst job:');
      console.log(JSON.stringify(jobs[0], null, 2));
    } else {
      console.log('\nNo jobs found in database. You may need to create some jobs first.');
    }
    
  } catch (error) {
    console.error('Error testing endpoint:', error.message);
    console.error('\nMake sure:');
    console.error('1. Backend server is running on port 5000');
    console.error('2. MongoDB is connected');
    console.error('3. No CORS issues');
  }
}

testJobsEndpoint();
