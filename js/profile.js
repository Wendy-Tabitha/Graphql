import { fetchUserInfo, fetchXpData, fetchProgressData, fetchResultData } from './api.js';

// Load and display user information in the profile view
export async function loadUserInfo() {
    try {
        const data = await fetchUserInfo();
        const user = data.user[0];
        document.getElementById('user-name').textContent = user.login;
        const userDetails = document.getElementById('user-details');
        userDetails.innerHTML = `
            <div class="user-card">
                <h3>${user.login}</h3>
                <p>User ID: ${user.id}</p>
                <p>Account Status: Active</p>
            </div>
        `;
        return user;
    } catch (error) {
        console.error('Error loading user info:', error);
        throw error;
    }
}

// Load and display XP data in the profile view
export async function loadXpData() {
    try {
        const data = await fetchXpData();
        const transactions = data.transaction;
        const totalXP = transactions.reduce((sum, t) => sum + t.amount, 0);
        const xpByProject = {};
        transactions.forEach(t => {
            const pathParts = t.path.split('/');
            const project = pathParts[pathParts.length - 1];
            if (!xpByProject[project]) {
                xpByProject[project] = 0;
            }
            xpByProject[project] += t.amount;
        });
        const sortedProjects = Object.entries(xpByProject)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        const xpDetails = document.getElementById('xp-details');
        xpDetails.innerHTML = `
            <div class="xp-summary">
                <div class="xp-total">
                    <h3>Total XP</h3>
                    <div class="xp-value">${(totalXP / 1_000_000).toFixed(2)} MB</div>
                </div>
                <div class="xp-projects">
                    <h3>Top Projects by XP</h3>
                    <ul>
                        ${sortedProjects.map(([project, xp]) => 
                            `<li><span>${project}</span>: <strong>${(xp / 1_000_000).toFixed(2)} MB</strong></li>`
                        ).join('')}
                    </ul>
                </div>
            </div>
        `;
        window.userData = window.userData || {};
        window.userData.xpData = transactions;
        return transactions;
    } catch (error) {
        console.error('Error loading XP data:', error);
        throw error;
    }
}

// Load and display grades data in the profile view
export async function loadGradesData() {
    try {
        const progressData = await fetchProgressData();
        const resultData = await fetchResultData();
        const progress = progressData.progress;
        const results = resultData.result;
        const passCount = results.filter(r => r.grade > 0).length;
        const failCount = results.filter(r => r.grade === 0).length;
        const passRatio = passCount / (passCount + failCount) * 100 || 0;
        const projectTypes = {};
        results.forEach(r => {
            const type = r.object?.type || 'unknown';
            if (!projectTypes[type]) {
                projectTypes[type] = { pass: 0, fail: 0 };
            }
            if (r.grade > 0) {
                projectTypes[type].pass++;
            } else {
                projectTypes[type].fail++;
            }
        });
        const gradesDetails = document.getElementById('grades-details');
        gradesDetails.innerHTML = `
            <div class="grades-summary">
                <div class="grades-ratio">
                    <h3>Pass/Fail Ratio</h3>
                    <div class="ratio-display">
                        <div class="ratio-bar">
                            <div class="ratio-pass" style="width: ${passRatio}%"></div>
                        </div>
                        <div class="ratio-text">
                            ${passRatio.toFixed(1)}% Pass Rate (${passCount} passed, ${failCount} failed)
                        </div>
                    </div>
                </div>
                <div class="project-types">
                    <h3>Projects by Type</h3>
                    <ul>
                        ${Object.entries(projectTypes).map(([type, counts]) => 
                            `<li>
                                <span>${type}</span>: 
                                <strong class="text-success">${counts.pass} passed</strong>, 
                                <strong class="text-danger">${counts.fail} failed</strong>
                            </li>`
                        ).join('')}
                    </ul>
                </div>
            </div>
        `;
        window.userData = window.userData || {};
        window.userData.gradesData = {
            progress,
            results
        };
        return { progress, results };
    } catch (error) {
        console.error('Error loading grades data:', error);
        throw error;
    }
} 