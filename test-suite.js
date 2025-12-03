/**
 * Comprehensive Test Suite for FreelanceHub
 * Tests all backend APIs, authentication, and core features
 */

import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

// Test results storage
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  tests: []
};

// Test users
let clientToken = '';
let freelancerToken = '';
let clientId = '';
let freelancerId = '';
let jobId = '';
let proposalId = '';
let contractId = '';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name, status, message = '') {
  testResults.total++;
  const icon = status === 'PASS' ? '✅' : '❌';
  const color = status === 'PASS' ? 'green' : 'red';
  
  if (status === 'PASS') {
    testResults.passed++;
  } else {
    testResults.failed++;
  }
  
  testResults.tests.push({ name, status, message });
  log(`${icon} ${name}${message ? ': ' + message : ''}`, color);
}

async function runTest(name, testFn) {
  try {
    await testFn();
    logTest(name, 'PASS');
    return true;
  } catch (error) {
    logTest(name, 'FAIL', error.message);
    return false;
  }
}

// ============================================
// HEALTH CHECK TESTS
// ============================================
async function testHealthCheck() {
  log('\n📋 HEALTH CHECK TESTS', 'cyan');
  log('═══════════════════════════════════════', 'cyan');
  
  await runTest('Server health check', async () => {
    const response = await axios.get(`${API_URL}/health`);
    if (response.data.status !== 'OK') throw new Error('Server not healthy');
  });
}

// ============================================
// AUTHENTICATION TESTS
// ============================================
async function testAuthentication() {
  log('\n🔐 AUTHENTICATION TESTS', 'cyan');
  log('═══════════════════════════════════════', 'cyan');
  
  // Test 1: Register Client
  await runTest('Register client user', async () => {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test Client',
      email: 'testclient@example.com',
      password: 'TestClient123!',
      role: 'client'
    });
    
    if (!response.data.success) throw new Error('Registration failed');
    if (!response.data.token) throw new Error('No token received');
    
    clientToken = response.data.token;
    clientId = response.data.user._id;
  });
  
  // Test 2: Register Freelancer
  await runTest('Register freelancer user', async () => {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test Freelancer',
      email: 'testfreelancer@example.com',
      password: 'TestFreelancer123!',
      role: 'freelancer',
      skills: ['JavaScript', 'React', 'Node.js']
    });
    
    if (!response.data.success) throw new Error('Registration failed');
    if (!response.data.token) throw new Error('No token received');
    
    freelancerToken = response.data.token;
    freelancerId = response.data.user._id;
  });
  
  // Test 3: Login Client
  await runTest('Login client user', async () => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'testclient@example.com',
      password: 'TestClient123!'
    });
    
    if (!response.data.success) throw new Error('Login failed');
    if (!response.data.token) throw new Error('No token received');
  });
  
  // Test 4: Login Freelancer
  await runTest('Login freelancer user', async () => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'testfreelancer@example.com',
      password: 'TestFreelancer123!'
    });
    
    if (!response.data.success) throw new Error('Login failed');
  });
  
  // Test 5: Invalid credentials
  await runTest('Reject invalid credentials', async () => {
    try {
      await axios.post(`${API_URL}/auth/login`, {
        email: 'testclient@example.com',
        password: 'WrongPassword'
      });
      throw new Error('Should have rejected invalid credentials');
    } catch (error) {
      if (error.response?.status !== 401) throw error;
    }
  });
  
  // Test 6: Get current user
  await runTest('Get authenticated user profile', async () => {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${clientToken}` }
    });
    
    if (!response.data.success) throw new Error('Failed to get user');
    if (response.data.user.email !== 'testclient@example.com') {
      throw new Error('Wrong user returned');
    }
  });
  
  // Test 7: Unauthorized access
  await runTest('Reject unauthorized access', async () => {
    try {
      await axios.get(`${API_URL}/auth/me`);
      throw new Error('Should have rejected unauthorized request');
    } catch (error) {
      if (error.response?.status !== 401) throw error;
    }
  });
}

// ============================================
// JOB MANAGEMENT TESTS
// ============================================
async function testJobManagement() {
  log('\n💼 JOB MANAGEMENT TESTS', 'cyan');
  log('═══════════════════════════════════════', 'cyan');
  
  // Test 1: Create job (client)
  await runTest('Client creates job posting', async () => {
    const response = await axios.post(`${API_URL}/jobs`, {
      title: 'Full Stack Web Development',
      description: 'Need a full stack developer for e-commerce website',
      category: 'Web Development',
      budget: 5000,
      duration: '2 months',
      skills: ['React', 'Node.js', 'MongoDB'],
      experienceLevel: 'intermediate'
    }, {
      headers: { Authorization: `Bearer ${clientToken}` }
    });
    
    if (!response.data.success) throw new Error('Job creation failed');
    jobId = response.data.job._id;
  });
  
  // Test 2: Freelancer cannot create job
  await runTest('Freelancer cannot create job', async () => {
    try {
      await axios.post(`${API_URL}/jobs`, {
        title: 'Test Job',
        description: 'Test',
        budget: 1000
      }, {
        headers: { Authorization: `Bearer ${freelancerToken}` }
      });
      throw new Error('Freelancer should not be able to create job');
    } catch (error) {
      if (error.response?.status !== 403) throw error;
    }
  });
  
  // Test 3: Get all jobs
  await runTest('Get all job listings', async () => {
    const response = await axios.get(`${API_URL}/jobs`);
    if (!response.data.success) throw new Error('Failed to get jobs');
    if (!Array.isArray(response.data.jobs)) throw new Error('Jobs not an array');
  });
  
  // Test 4: Get single job
  await runTest('Get single job details', async () => {
    const response = await axios.get(`${API_URL}/jobs/${jobId}`);
    if (!response.data.success) throw new Error('Failed to get job');
    if (response.data.job.title !== 'Full Stack Web Development') {
      throw new Error('Wrong job returned');
    }
  });
  
  // Test 5: Update job (client)
  await runTest('Client updates job posting', async () => {
    const response = await axios.put(`${API_URL}/jobs/${jobId}`, {
      budget: 6000
    }, {
      headers: { Authorization: `Bearer ${clientToken}` }
    });
    
    if (!response.data.success) throw new Error('Job update failed');
    if (response.data.job.budget !== 6000) throw new Error('Budget not updated');
  });
  
  // Test 6: Search jobs
  await runTest('Search jobs by skills', async () => {
    const response = await axios.get(`${API_URL}/jobs?skills=React`);
    if (!response.data.success) throw new Error('Search failed');
  });
}

// ============================================
// PROPOSAL TESTS
// ============================================
async function testProposals() {
  log('\n📝 PROPOSAL TESTS', 'cyan');
  log('═══════════════════════════════════════', 'cyan');
  
  // Test 1: Freelancer submits proposal
  await runTest('Freelancer submits proposal', async () => {
    const response = await axios.post(`${API_URL}/proposals`, {
      jobId: jobId,
      coverLetter: 'I am experienced in full stack development...',
      proposedBudget: 5500,
      estimatedDuration: '1.5 months'
    }, {
      headers: { Authorization: `Bearer ${freelancerToken}` }
    });
    
    if (!response.data.success) throw new Error('Proposal submission failed');
    proposalId = response.data.proposal._id;
  });
  
  // Test 2: Client cannot submit proposal
  await runTest('Client cannot submit proposal', async () => {
    try {
      await axios.post(`${API_URL}/proposals`, {
        jobId: jobId,
        coverLetter: 'Test',
        proposedBudget: 1000
      }, {
        headers: { Authorization: `Bearer ${clientToken}` }
      });
      throw new Error('Client should not be able to submit proposal');
    } catch (error) {
      if (error.response?.status !== 403) throw error;
    }
  });
  
  // Test 3: Get proposals for job (client)
  await runTest('Client views job proposals', async () => {
    const response = await axios.get(`${API_URL}/proposals/job/${jobId}`, {
      headers: { Authorization: `Bearer ${clientToken}` }
    });
    
    if (!response.data.success) throw new Error('Failed to get proposals');
    if (!Array.isArray(response.data.proposals)) throw new Error('Proposals not an array');
  });
  
  // Test 4: Get freelancer's proposals
  await runTest('Freelancer views own proposals', async () => {
    const response = await axios.get(`${API_URL}/proposals/my-proposals`, {
      headers: { Authorization: `Bearer ${freelancerToken}` }
    });
    
    if (!response.data.success) throw new Error('Failed to get proposals');
  });
  
  // Test 5: Accept proposal (creates contract)
  await runTest('Client accepts proposal', async () => {
    const response = await axios.put(`${API_URL}/proposals/${proposalId}/accept`, {}, {
      headers: { Authorization: `Bearer ${clientToken}` }
    });
    
    if (!response.data.success) throw new Error('Proposal acceptance failed');
    if (response.data.contract) {
      contractId = response.data.contract._id;
    }
  });
}

// ============================================
// CONTRACT TESTS
// ============================================
async function testContracts() {
  log('\n📄 CONTRACT TESTS', 'cyan');
  log('═══════════════════════════════════════', 'cyan');
  
  // Test 1: Get user contracts
  await runTest('Get user contracts', async () => {
    const response = await axios.get(`${API_URL}/contracts`, {
      headers: { Authorization: `Bearer ${clientToken}` }
    });
    
    if (!response.data.success) throw new Error('Failed to get contracts');
    if (!Array.isArray(response.data.contracts)) throw new Error('Contracts not an array');
  });
  
  // Test 2: Get single contract
  if (contractId) {
    await runTest('Get contract details', async () => {
      const response = await axios.get(`${API_URL}/contracts/${contractId}`, {
        headers: { Authorization: `Bearer ${clientToken}` }
      });
      
      if (!response.data.success) throw new Error('Failed to get contract');
    });
  }
  
  // Test 3: Add milestone
  if (contractId) {
    await runTest('Add milestone to contract', async () => {
      const response = await axios.post(`${API_URL}/contracts/${contractId}/milestones`, {
        title: 'Initial Setup',
        description: 'Setup project structure',
        amount: 2000,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }, {
        headers: { Authorization: `Bearer ${clientToken}` }
      });
      
      if (!response.data.success) throw new Error('Failed to add milestone');
    });
  }
  
  // Test 4: Submit deliverable
  if (contractId) {
    await runTest('Freelancer submits deliverable', async () => {
      const response = await axios.post(`${API_URL}/contracts/${contractId}/deliverables`, {
        title: 'Project Setup Complete',
        description: 'Initial project structure and setup',
        fileUrl: 'https://example.com/deliverable.zip'
      }, {
        headers: { Authorization: `Bearer ${freelancerToken}` }
      });
      
      if (!response.data.success) throw new Error('Failed to submit deliverable');
    });
  }
}

// ============================================
// MESSAGE TESTS
// ============================================
async function testMessages() {
  log('\n💬 MESSAGING TESTS', 'cyan');
  log('═══════════════════════════════════════', 'cyan');
  
  // Test 1: Send message
  await runTest('Send message', async () => {
    const response = await axios.post(`${API_URL}/messages`, {
      receiverId: freelancerId,
      content: 'Hello, I have a question about the project.'
    }, {
      headers: { Authorization: `Bearer ${clientToken}` }
    });
    
    if (!response.data.success) throw new Error('Failed to send message');
  });
  
  // Test 2: Get conversations
  await runTest('Get user conversations', async () => {
    const response = await axios.get(`${API_URL}/messages/conversations`, {
      headers: { Authorization: `Bearer ${clientToken}` }
    });
    
    if (!response.data.success) throw new Error('Failed to get conversations');
  });
  
  // Test 3: Get conversation with specific user
  await runTest('Get conversation with user', async () => {
    const response = await axios.get(`${API_URL}/messages/${freelancerId}`, {
      headers: { Authorization: `Bearer ${clientToken}` }
    });
    
    if (!response.data.success) throw new Error('Failed to get messages');
  });
  
  // Test 4: Mark messages as read
  await runTest('Mark messages as read', async () => {
    const response = await axios.put(`${API_URL}/messages/${clientId}/read`, {}, {
      headers: { Authorization: `Bearer ${freelancerToken}` }
    });
    
    if (!response.data.success) throw new Error('Failed to mark as read');
  });
}

// ============================================
// REVIEW TESTS
// ============================================
async function testReviews() {
  log('\n⭐ REVIEW TESTS', 'cyan');
  log('═══════════════════════════════════════', 'cyan');
  
  // Test 1: Create review
  await runTest('Submit review', async () => {
    const response = await axios.post(`${API_URL}/reviews`, {
      revieweeId: freelancerId,
      rating: 5,
      comment: 'Excellent work! Very professional and delivered on time.',
      contractId: contractId
    }, {
      headers: { Authorization: `Bearer ${clientToken}` }
    });
    
    if (!response.data.success) throw new Error('Failed to create review');
  });
  
  // Test 2: Get user reviews
  await runTest('Get user reviews', async () => {
    const response = await axios.get(`${API_URL}/reviews/user/${freelancerId}`);
    
    if (!response.data.success) throw new Error('Failed to get reviews');
    if (!Array.isArray(response.data.reviews)) throw new Error('Reviews not an array');
  });
}

// ============================================
// NOTIFICATION TESTS
// ============================================
async function testNotifications() {
  log('\n🔔 NOTIFICATION TESTS', 'cyan');
  log('═══════════════════════════════════════', 'cyan');
  
  // Test 1: Get notifications
  await runTest('Get user notifications', async () => {
    const response = await axios.get(`${API_URL}/notifications`, {
      headers: { Authorization: `Bearer ${freelancerToken}` }
    });
    
    if (!response.data.success) throw new Error('Failed to get notifications');
    if (!Array.isArray(response.data.notifications)) {
      throw new Error('Notifications not an array');
    }
  });
  
  // Test 2: Mark all as read
  await runTest('Mark all notifications as read', async () => {
    const response = await axios.put(`${API_URL}/notifications/read-all`, {}, {
      headers: { Authorization: `Bearer ${freelancerToken}` }
    });
    
    if (!response.data.success) throw new Error('Failed to mark notifications as read');
  });
}

// ============================================
// SOCKET.IO TESTS
// ============================================
async function testSocketIO() {
  log('\n🔌 REAL-TIME MESSAGING TESTS', 'cyan');
  log('═══════════════════════════════════════', 'cyan');
  
  await runTest('Socket.io connection', async () => {
    return new Promise((resolve, reject) => {
      const socket = io(SOCKET_URL);
      
      socket.on('connect', () => {
        socket.disconnect();
        resolve();
      });
      
      socket.on('connect_error', (error) => {
        reject(new Error('Socket connection failed: ' + error.message));
      });
      
      setTimeout(() => {
        socket.disconnect();
        reject(new Error('Socket connection timeout'));
      }, 5000);
    });
  });
}

// ============================================
// MAIN TEST RUNNER
// ============================================
async function runAllTests() {
  log('\n╔═══════════════════════════════════════════════════════╗', 'blue');
  log('║     FREELANCEHUB COMPREHENSIVE TEST SUITE            ║', 'blue');
  log('╚═══════════════════════════════════════════════════════╝', 'blue');
  
  const startTime = Date.now();
  
  try {
    await testHealthCheck();
    await testAuthentication();
    await testJobManagement();
    await testProposals();
    await testContracts();
    await testMessages();
    await testReviews();
    await testNotifications();
    await testSocketIO();
  } catch (error) {
    log(`\n❌ Critical error: ${error.message}`, 'red');
  }
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  // Print summary
  log('\n╔═══════════════════════════════════════════════════════╗', 'blue');
  log('║                   TEST SUMMARY                        ║', 'blue');
  log('╚═══════════════════════════════════════════════════════╝', 'blue');
  
  log(`\n📊 Total Tests: ${testResults.total}`, 'cyan');
  log(`✅ Passed: ${testResults.passed}`, 'green');
  log(`❌ Failed: ${testResults.failed}`, 'red');
  log(`⏱️  Duration: ${duration}s`, 'yellow');
  log(`📈 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(2)}%`, 'cyan');
  
  if (testResults.failed > 0) {
    log('\n❌ Failed Tests:', 'red');
    testResults.tests
      .filter(t => t.status === 'FAIL')
      .forEach(t => log(`   - ${t.name}: ${t.message}`, 'red'));
  }
  
  log('\n' + '═'.repeat(60), 'blue');
  
  // Save results to file
  const fs = await import('fs');
  fs.writeFileSync(
    'test-results.json',
    JSON.stringify({
      ...testResults,
      duration,
      timestamp: new Date().toISOString()
    }, null, 2)
  );
  
  log('\n💾 Test results saved to test-results.json', 'cyan');
  
  process.exit(testResults.failed > 0 ? 1 : 0);
}

// Run tests
runAllTests();
