import axios from 'axios';

// Base URL cho API backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Tạo axios instance với config mặc định
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header nếu có
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response và errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API functions cho Funds
export const fundAPI = {
  // Lấy danh sách tất cả quỹ
  getAll: (params = {}) => api.get('/funds', { params }),
  
  // Lấy thông tin một quỹ theo ID
  getById: (id) => api.get(`/funds/${id}`),
  
  // Tạo quỹ mới
  create: (data) => api.post('/funds', data),
  
  // Cập nhật thông tin quỹ
  update: (id, data) => api.put(`/funds/${id}`, data),
  
  // Xóa quỹ
  delete: (id) => api.delete(`/funds/${id}`),
  
  // Lấy danh sách quỹ theo category
  getByCategory: (category) => api.get('/funds', { params: { category } }),
  
  // Tìm kiếm quỹ
  search: (query) => api.get('/funds', { params: { search: query } }),
};

// API functions cho Authentication
export const authAPI = {
  // Kết nối ví và đăng nhập
  connectWallet: (data) => api.post('/auth/connect', data),
  
  // Đăng xuất (client side)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('walletAddress');
  },
  
  // Cập nhật profile
  updateProfile: (data) => api.put('/auth/profile', data),

  // Lấy thông tin user theo địa chỉ ví
  getUser: (address) => api.get(`/auth/${address}`),

  // Lấy danh sách users
  getUsers: (params = {}) => api.get('/auth', { params }),
};

// API functions cho Donations
export const donationAPI = {
  // Lấy lịch sử giao dịch của user
  getUserHistory: (address, params = {}) => api.get(`/donations/user/${address}`, { params }),
  
  // Lấy lịch sử giao dịch của quỹ
  getFundHistory: (fundId, params = {}) => api.get(`/donations/fund/${fundId}`, { params }),
};

export default api;

