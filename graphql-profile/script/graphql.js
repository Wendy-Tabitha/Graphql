// Constants
const GRAPHQL_ENDPOINT = 'https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql';

// GraphQL query functions
async function executeQuery(query, variables = {}) {
    try {
        const response = await fetch(GRAPHQL_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify({
                query,
                variables
            })
        });

        if (!response.ok) {
            throw new Error('GraphQL query failed');
        }

        const data = await response.json();
        if (data.errors) {
            throw new Error(data.errors[0].message);
        }

        return data.data;
    } catch (error) {
        console.error('GraphQL Error:', error);
        throw error;
    }
}

// User profile query
const getUserProfile = async () => {
    const query = `
        query GetUserProfile {
            user {
                id
                login
                totalXP
                grade
                projects {
                    id
                    name
                    status
                    attempts
                    lastAttempt
                }
            }
        }
    `;
    return executeQuery(query);
};

// XP progress query
const getXPProgress = async () => {
    const query = `
        query GetXPProgress {
            xpProgress {
                date
                amount
            }
        }
    `;
    return executeQuery(query);
};

// Project statistics query
const getProjectStats = async () => {
    const query = `
        query GetProjectStats {
            projectStats {
                total
                passed
                failed
                attempts {
                    projectId
                    count
                }
            }
        }
    `;
    return executeQuery(query);
};

// Audit history query
const getAuditHistory = async () => {
    const query = `
        query GetAuditHistory {
            audits {
                date
                type
                status
                details
            }
        }
    `;
    return executeQuery(query);
};

// Nested query example
const getDetailedProjectInfo = async (projectId) => {
    const query = `
        query GetDetailedProjectInfo($projectId: Int!) {
            project(where: { id: { _eq: $projectId } }) {
                id
                name
                status
                attempts {
                    id
                    date
                    result
                    user {
                        login
                    }
                }
                audits {
                    id
                    date
                    type
                    status
                }
            }
        }
    `;
    return executeQuery(query, { projectId });
};

// Export functions
window.graphql = {
    getUserProfile,
    getXPProgress,
    getProjectStats,
    getAuditHistory,
    getDetailedProjectInfo
}; 