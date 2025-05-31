// Constants
const API_DOMAIN = 'https://learn.zone01kisumu.ke';
const TOKEN_KEY = 'auth_token';

// DOM Elements
const loginForm = document.getElementById('login-form');
const loginSection = document.getElementById('login-section');
const profileSection = document.getElementById('profile-section');
const logoutBtn = document.getElementById('logout-btn');

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && isValidToken(token)) {
        showProfile();
    } else {
        showLogin();
    }
});

// Handle login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError('login-error');

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const credentials = base64Encode(`${username}:${password}`);

    try {
        // Try the alternative endpoint
        const apiUrl = `${API_DOMAIN}/api/auth/login`;
        console.log('Attempting login to:', apiUrl);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.text();
            console.error('Login failed:', errorData);
            throw new Error(`Login failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
        
        // Check for token in different possible locations
        const token = data.token || data.access_token || data.jwt || data.data?.token;
        
        if (!token) {
            console.error('No token found in response. Response data:', data);
            throw new Error('No authentication token received from server');
        }

        console.log('Login successful, received token');
        localStorage.setItem(TOKEN_KEY, token);
        showProfile();
    } catch (error) {
        console.error('Login error:', error);
        showError('login-error', `Login failed: ${error.message}`);
    }
});

// Handle logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem(TOKEN_KEY);
    showLogin();
});

// Show login section
function showLogin() {
    toggleVisibility('login-section', true);
    toggleVisibility('profile-section', false);
    loginForm.reset();
}

// Show profile section
function showProfile() {
    toggleVisibility('login-section', false);
    toggleVisibility('profile-section', true);
    loadProfileData();
}

// Get authentication token
function getAuthToken() {
    return localStorage.getItem(TOKEN_KEY);
}

// Get authorization header
function getAuthHeader() {
    const token = getAuthToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Check if user is authenticated
function isAuthenticated() {
    const token = getAuthToken();
    return token && isValidToken(token);
} 