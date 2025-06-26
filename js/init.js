import { logout, isLoggedIn, TOKEN_KEY, API_BASE_URL, AUTH_ENDPOINT } from './auth.js';
import { initSidebar, showLoginView, showProfileView, setupLoginForm } from './ui.js';
import { loadUserInfo, loadXpData, loadGradesData } from './profile.js';
import { setupGraphButtons } from './graph.js';

// Initialize authentication and set up the app UI based on login state
function initAuth() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    if (isLoggedIn()) {
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
    } else {
        showLoginView();
        setupLoginForm();
    }
}

// Run initialization when DOM is loaded
// Entry point for the app

document.addEventListener('DOMContentLoaded', initAuth); 