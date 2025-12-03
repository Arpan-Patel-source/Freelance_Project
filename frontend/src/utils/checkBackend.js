// Utility to check backend connection
export async function checkBackendConnection() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend is running:', data);
      return { connected: true, message: data.message };
    } else {
      console.error('❌ Backend returned error:', response.status);
      return { connected: false, message: `Backend error: ${response.status}` };
    }
  } catch (error) {
    console.error('❌ Cannot connect to backend:', error.message);
    return { 
      connected: false, 
      message: 'Backend server is not running or unreachable',
      error: error.message 
    };
  }
}

// Test login endpoint specifically
export async function testLoginEndpoint(email, password) {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    console.log('Login Response Status:', response.status);
    console.log('Login Response Data:', data);
    
    return {
      success: response.ok,
      status: response.status,
      data: data,
    };
  } catch (error) {
    console.error('Login Request Failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}
