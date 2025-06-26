import { API_BASE_URL, GRAPHQL_ENDPOINT, TOKEN_KEY, parseJwt } from './auth.js';

export function getAuthToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function getUserId() {
    const token = getAuthToken();
    if (!token) return null;
    const decoded = parseJwt(token);
    return decoded?.sub || null;
}

export async function executeQuery(query, variables = {}) {
    const token = getAuthToken();
    if (!token) {
        throw new Error('Not authenticated');
    }
    try {
        const response = await fetch(`${API_BASE_URL}${GRAPHQL_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ query, variables })
        });
        if (!response.ok) {
            throw new Error('GraphQL request failed');
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

export async function fetchUserInfo() {
    const query = `{
        user {
            id
            login
        }
    }`;
    return executeQuery(query);
}

export async function fetchXpData() {
    const query = `{
        transaction(where: {type: {_eq: "xp"} eventId: {_eq: 75}}) {
            id
            amount
            createdAt
            path
            objectId
            object {
                name
                type
            }
        }
    }`;
    return executeQuery(query);
}

export async function fetchProgressData() {
    const query = `{
        progress {
            id
            userId
            objectId
            grade
            createdAt
            updatedAt
            path
            object {
                name
                type
            }
        }
    }`;
    return executeQuery(query);
}

export async function fetchResultData() {
    const query = `{
        result {
            id
            objectId
            userId
            grade
            createdAt
            updatedAt
            path
            object {
                name
                type
            }
        }
    }`;
    return executeQuery(query);
} 