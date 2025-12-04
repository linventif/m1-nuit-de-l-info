// API client for frontend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Generic API request handler
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} Response data
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * GET request
 */
export async function get(endpoint) {
  return apiRequest(endpoint, { method: 'GET' });
}

/**
 * POST request
 */
export async function post(endpoint, data) {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT request
 */
export async function put(endpoint, data) {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE request
 */
export async function del(endpoint) {
  return apiRequest(endpoint, { method: 'DELETE' });
}

// User API endpoints
export const userAPI = {
  getAll: () => get('/api/users'),
  getById: (id) => get(`/api/users/${id}`),
  create: (userData) => post('/api/users', userData),
  update: (id, userData) => put(`/api/users/${id}`, userData),
  delete: (id) => del(`/api/users/${id}`),
};

// Health check
export const healthAPI = {
  check: () => get('/health'),
};
