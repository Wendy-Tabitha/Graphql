import { logout, isLoggedIn, API_BASE_URL, AUTH_ENDPOINT, TOKEN_KEY } from './auth.js';
import { loadUserInfo, loadXpData, loadGradesData } from './profile.js';
import { setupGraphButtons } from './graph.js';

// Initialize sidebar navigation and section switching
export function initSidebar() {
    const navLinks = document.querySelectorAll('.sidebar nav a');
    const sections = document.querySelectorAll('section');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            const targetId = link.getAttribute('href');
            sections.forEach(section => {
                section.style.display = 'none';
            });
            document.querySelector(targetId).style.display = 'block';
        });
    });
    sections.forEach((section, index) => {
        section.style.display = index === 0 ? 'block' : 'none';
    });
}

// Show the login view and hide the profile view
export function showLoginView() {
    document.getElementById('login-view').style.display = 'block';
    document.getElementById('profile-view').style.display = 'none';
    document.title = 'Profile - Login';
}

// Show the profile view and hide the login view
export function showProfileView() {
    document.getElementById('login-view').classList.add('fade-out');
    setTimeout(() => {
        document.getElementById('login-view').style.display = 'none';
        document.getElementById('profile-view').style.display = 'block';
        document.getElementById('profile-view').classList.add('fade-in');
        document.title = 'Student Profile';
    }, 500);
}

// Set up the login form submission and handle login logic
export function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            errorMessage.style.display = 'none';
            try {
                const credentials = btoa(`${username}:${password}`);
                const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINT}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Basic ${credentials}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Invalid credentials');
                }
                const token = await response.json();
                localStorage.setItem(TOKEN_KEY, token);
                showProfileView();
                initSidebar();
                loadUserInfo()
                    .then(() => loadXpData())
                    .then(() => loadGradesData())
                    .then(() => setupGraphButtons())
                    .catch(error => {
                        console.error('Error loading profile data:', error);
                        if (error.message === 'Not authenticated') {
                            logout();
                        }
                    });
            } catch (error) {
                errorMessage.textContent = error.message || 'Failed to login. Please try again.';
                errorMessage.style.display = 'block';
            }
        });
    }
} 