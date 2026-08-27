const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
  }
  return response.status === 204 ? null : response.json();
}

export const aiSystemsApi = {
  list: () => request('/ai-systems'),
  get: (id) => request(`/ai-systems/${id}`),
  create: (system) => request('/ai-systems', { method: 'POST', body: JSON.stringify(system) })
};
