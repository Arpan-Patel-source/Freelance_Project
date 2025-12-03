/**
 * Setup Test Users for TestSprite Testing
 * This script creates test accounts for both client and freelancer roles
 */

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const testUsers = [
  {
    name: 'Test Client',
    email: 'testclient@example.com',
    password: 'TestClient123!',
    role: 'client',
    skills: []
  },
  {
    name: 'Test Freelancer',
    email: 'testfreelancer@example.com',
    password: 'TestFreelancer123!',
    role: 'freelancer',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB']
  }
];

async function setupTestUsers() {
  console.log('🚀 Setting up test users for TestSprite...\n');

  for (const user of testUsers) {
    try {
      console.log(`Creating ${user.role}: ${user.email}`);
      
      const response = await axios.post(`${API_URL}/auth/register`, user);
      
      if (response.data.success) {
        console.log(`✅ Successfully created ${user.role} account`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Token: ${response.data.token.substring(0, 20)}...`);
      }
    } catch (error) {
      if (error.response?.data?.message?.includes('already exists')) {
        console.log(`ℹ️  ${user.role} account already exists: ${user.email}`);
      } else {
        console.error(`❌ Error creating ${user.role}:`, error.response?.data?.message || error.message);
      }
    }
    console.log('');
  }

  console.log('✨ Test user setup complete!\n');
  console.log('Test Credentials:');
  console.log('─────────────────────────────────────────');
  console.log('Client Account:');
  console.log('  Email: testclient@example.com');
  console.log('  Password: TestClient123!');
  console.log('');
  console.log('Freelancer Account:');
  console.log('  Email: testfreelancer@example.com');
  console.log('  Password: TestFreelancer123!');
  console.log('─────────────────────────────────────────\n');
}

// Run the setup
setupTestUsers().catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
