// Authentication functionality
// Base URL for the API
export const API_BASE_URL = 'https://learn.zone01kisumu.ke';
// Endpoint for authentication
export const AUTH_ENDPOINT = '/api/auth/signin';
// Endpoint for GraphQL queries
export const GRAPHQL_ENDPOINT = '/api/graphql-engine/v1/graphql';
// Key used to store the auth token in localStorage
export const TOKEN_KEY = 'auth_token';

// Check if the user is logged in by checking for a token
export function isLoggedIn() {
    return localStorage.getItem(TOKEN_KEY) !== null;
}

// Log out the user and reset the UI
export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    const profileView = document.getElementById('profile-view');
    const loginView = document.getElementById('login-view');
    profileView.classList.add('fade-out');
    setTimeout(() => {
        profileView.classList.remove('fade-out');
        profileView.style.display = 'none';
        loginView.style.display = 'block';
        loginView.classList.remove('fade-in');
        document.title = 'Profile - Login';
        reloadPage();
    }, 500);
}

// Reload the current page
export function reloadPage() {
    window.location.reload();
}

// Parse a JWT token and return its payload as an object
export function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Error parsing JWT:', e);
        return null;
    }
} 