const API_BASE_URL = 'https://commercebackend-production-68d6.up.railway.app/';

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
