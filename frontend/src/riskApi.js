const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!response.ok) throw new Error(await response.text() || `Request failed with ${response.status}`);
  return response.json();
}

export const riskApi = {
  listForSystem: (id) => request(`/risk-assessments/ai-system/${id}`),
  create: (assessment) => request('/risk-assessments', { method: 'POST', body: JSON.stringify(assessment) })
};
