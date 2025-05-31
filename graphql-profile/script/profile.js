// Profile Data Loading and Rendering

// Load all profile data
async function loadProfileData() {
    try {
        const [profile, xpProgress, projectStats, auditHistory] = await Promise.all([
            graphql.getUserProfile(),
            graphql.getXPProgress(),
            graphql.getProjectStats(),
            graphql.getAuditHistory()
        ]);

        updateProfileInfo(profile);
        updateCharts(xpProgress, projectStats, auditHistory);
    } catch (error) {
        console.error('Error loading profile data:', error);
        showError('login-error', 'Failed to load profile data. Please try again.');
    }
}

// Update profile information
function updateProfileInfo(profile) {
    const { user } = profile;
    
    // Update user login
    document.getElementById('user-login').textContent = user.login;
    
    // Update stats
    document.getElementById('total-xp').textContent = formatNumber(user.totalXP);
    document.getElementById('grade-average').textContent = `${user.grade}%`;
    document.getElementById('projects-completed').textContent = 
        user.projects.filter(p => p.status === 'passed').length;
}

// Update all charts
function updateCharts(xpProgress, projectStats, auditHistory) {
    // Clear existing charts
    ['xp-graph', 'success-graph', 'audit-graph'].forEach(id => {
        const container = document.getElementById(id);
        container.innerHTML = '';
    });

    // Create new charts
    charts.createXPProgressChart(xpProgress.xpProgress, 'xp-graph');
    charts.createSuccessRateChart(projectStats.projectStats, 'success-graph');
    charts.createAuditHistoryChart(auditHistory.audits, 'audit-graph');
}

// Handle window resize for responsive charts
const debouncedResize = debounce(() => {
    if (document.getElementById('profile-section').classList.contains('hidden')) {
        return;
    }
    loadProfileData();
}, 250);

window.addEventListener('resize', debouncedResize);

// Export functions
window.profile = {
    loadProfileData,
    updateProfileInfo,
    updateCharts
}; 