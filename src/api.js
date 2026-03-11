import axios from 'axios';

const API_BASE_URL = 'https://course-platform-production.up.railway.app/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const loginApi = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  const { token, userId, email: userEmail, role } = response.data;
  localStorage.setItem('token', token);
  return { userId, userEmail, role };
};

export const registerApi = async (email, password, fullName) => {
  const response = await api.post('/auth/register', { email, password, fullName });
  const { token } = response.data;
  localStorage.setItem('token', token);
  return response.data;
};

export const getCourses = () => api.get('/courses');
export const createCourse = (title, description, price) => 
  api.post('/courses', { title, description, price });
export const getCourse = (id) => api.get(`/courses/${id}`);

export const logout = () => {
  localStorage.removeItem('token');
};

export const healthCheck = () => api.get('/health');

export default api;
