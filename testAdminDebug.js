// Debug test to see full responses
const API_URL = 'http://localhost:5000/api';

async function testAdminDebug() {
    try {
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@platform.com',
                password: 'Admin@12345'
            })
        });

        const loginData = await loginRes.json();
        const token = loginData.token;

        // Test jobs - with debug
        console.log('Testing jobs endpoint...');
        const jobsRes = await fetch(`${API_URL}/jobs/client/my-jobs`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const jobsText = await jobsRes.text();
        console.log('Jobs response status:', jobsRes.status);
        console.log('Jobs response:', jobsText);

        // Test proposals - with debug  
        console.log('\nTesting proposals endpoint...');
        const proposalsRes = await fetch(`${API_URL}/proposals/my-proposals`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const proposalsText = await proposalsRes.text();
        console.log('Proposals response status:', proposalsRes.status);
        console.log('Proposals response:', proposalsText);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testAdminDebug();
