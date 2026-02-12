const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const API_URL = API_BASE_URL;

export const apiEndpoints = {
  login: `${API_BASE_URL}/api/login`,
  logout: `${API_BASE_URL}/api/logout`,
  register: `${API_BASE_URL}/api/signup`,
  products: `${API_BASE_URL}/api/products`,
  orders: `${API_BASE_URL}/api/orders`,
  comments: `${API_BASE_URL}/api/comments`,
  users: `${API_BASE_URL}/api/users`,
  health: `${API_BASE_URL}/api/health`,
};
