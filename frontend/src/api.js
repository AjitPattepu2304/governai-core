const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

async function request(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        }
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Request failed with ${response.status}`);
    }

    return response.status === 204 ? null : response.json();
}

export const authApi = {
    me: () => request('/auth/me', {credentials: 'include'}),
    login: (credentials) => request('/auth/login', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(credentials)
    }),
    register: (account) => request('/auth/register', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(account)
    }),
    logout: () => request('/auth/logout', {method: 'POST', credentials: 'include'})
};

export const aiSystemsApi = {
    list: () => request('/ai-systems'),
    get: (id) => request(`/ai-systems/${id}`),
    create: (system) => request('/ai-systems', {method: 'POST', body: JSON.stringify(system)})
};
