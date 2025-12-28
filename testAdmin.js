// Simple test using node's built-in fetch
const API_URL = 'http://localhost:5000/api';

async function testAdmin() {
    try {
        console.log('🔐 Logging in as admin...\n');

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
        console.log('✅ Login successful');
        console.log(`User: ${loginData.name}, Role: ${loginData.role}\n`);

        // Test contracts
        console.log('📋 Testing /api/contracts...');
        const contractsRes = await fetch(`${API_URL}/contracts`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const contracts = await contractsRes.json();
        console.log(`✅ Contracts: ${contracts.length} returned`);
        if (contracts.length > 0) {
            console.log(`   First contract: ${contracts[0]._id}, Status: ${contracts[0].status}, Amount: ${contracts[0].totalAmount}`);
        }

        // Test jobs
        console.log('\n📋 Testing /api/jobs/client/my-jobs...');
        const jobsRes = await fetch(`${API_URL}/jobs/client/my-jobs`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const jobs = await jobsRes.json();
        console.log(`✅ Jobs: ${jobs.length} returned`);
        if (jobs.length > 0) {
            console.log(`   First job: ${jobs[0].title}, Status: ${jobs[0].status}`);
        }

        // Test proposals
        console.log('\n📋 Testing /api/proposals/my-proposals...');
        const proposalsRes = await fetch(`${API_URL}/proposals/my-proposals`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const proposals = await proposalsRes.json();
        console.log(`✅ Proposals: ${proposals.length} returned`);
        if (proposals.length > 0) {
            console.log(`   First proposal: Status: ${proposals[0].status}, Bid: ${proposals[0].bidAmount}`);
        }

        console.log('\n✅ All API endpoints working for admin!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testAdmin();
