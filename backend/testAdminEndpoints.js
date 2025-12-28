import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const testAdminEndpoints = async () => {
    try {
        console.log('🔐 Logging in as admin...\n');

        // Login as admin
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@platform.com',
            password: 'Admin@12345'
        });

        const token = loginRes.data.token;
        console.log('✅ Login successful\n');

        // Test contracts endpoint
        console.log('📋 Testing /api/contracts endpoint...');
        const contractsRes = await axios.get(`${API_URL}/contracts`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`✅ Contracts returned: ${contractsRes.data.length}`);
        console.log(`   Sample data:`, contractsRes.data.slice(0, 2).map(c => ({
            id: c._id,
            status: c.status,
            amount: c.totalAmount
        })));

        // Test jobs endpoint
        console.log('\n📋 Testing /api/jobs/client/my-jobs endpoint...');
        const jobsRes = await axios.get(`${API_URL}/jobs/client/my-jobs`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`✅ Jobs returned: ${jobsRes.data.length}`);
        console.log(`   Sample data:`, jobsRes.data.slice(0, 2).map(j => ({
            id: j._id,
            title: j.title,
            status: j.status
        })));

        // Test proposals endpoint
        console.log('\n📋 Testing /api/proposals/my-proposals endpoint...');
        const proposalsRes = await axios.get(`${API_URL}/proposals/my-proposals`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`✅ Proposals returned: ${proposalsRes.data.length}`);
        console.log(`   Sample data:`, proposalsRes.data.slice(0, 2).map(p => ({
            id: p._id,
            status: p.status,
            bidAmount: p.bidAmount
        })));

        console.log('\n✅ All endpoints working correctly!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        process.exit(1);
    }
};

testAdminEndpoints();
