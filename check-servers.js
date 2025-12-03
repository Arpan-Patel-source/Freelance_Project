/**
 * Check if backend and frontend servers are running
 */

import http from 'http';

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

function checkServer(host, port, name) {
  return new Promise((resolve) => {
    const req = http.get(`http://${host}:${port}`, (res) => {
      resolve(true);
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function checkServers() {
  log('\n╔═══════════════════════════════════════════════════════╗', 'blue');
  log('║           SERVER STATUS CHECK                        ║', 'blue');
  log('╚═══════════════════════════════════════════════════════╝', 'blue');
  log('');
  
  // Check backend
  log('🔍 Checking Backend Server (http://localhost:5000)...', 'cyan');
  const backendRunning = await checkServer('localhost', 5000, 'Backend');
  
  if (backendRunning) {
    log('✅ Backend is running', 'green');
  } else {
    log('❌ Backend is NOT running', 'red');
    log('   Start with: cd backend && npm run dev', 'yellow');
  }
  
  log('');
  
  // Check frontend
  log('🔍 Checking Frontend Server (http://localhost:5173)...', 'cyan');
  const frontendRunning = await checkServer('localhost', 5173, 'Frontend');
  
  if (frontendRunning) {
    log('✅ Frontend is running', 'green');
  } else {
    log('❌ Frontend is NOT running', 'red');
    log('   Start with: cd frontend && npm run dev', 'yellow');
  }
  
  log('');
  log('═══════════════════════════════════════════════════════', 'blue');
  log('');
  
  if (backendRunning && frontendRunning) {
    log('✅ All servers are running! Ready to test.', 'green');
    log('');
    log('Run tests with:', 'cyan');
    log('  node test-suite.js', 'yellow');
    log('  or', 'cyan');
    log('  .\\run-tests.ps1 (PowerShell)', 'yellow');
    log('  run-tests.bat (Command Prompt)', 'yellow');
    return 0;
  } else {
    log('⚠️  Not all servers are running', 'yellow');
    log('');
    log('To start the servers:', 'cyan');
    log('');
    log('Terminal 1 - Backend:', 'cyan');
    log('  cd backend', 'yellow');
    log('  npm run dev', 'yellow');
    log('');
    log('Terminal 2 - Frontend:', 'cyan');
    log('  cd frontend', 'yellow');
    log('  npm run dev', 'yellow');
    return 1;
  }
}

checkServers().then(exitCode => {
  process.exit(exitCode);
});
