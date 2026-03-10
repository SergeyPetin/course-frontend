import axios from 'axios';

export const API = 'https://course-platform-production.up.railway.app';

// Интерсептор токена
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const loginApi = async (email, password) => {
  const response = await axios.post(`${API}/auth/login`, { email, password });
  const { token, userId, email: userEmail, role } = response.data;
  localStorage.setItem('token', token);
  return { userId, userEmail, role };
};

export const registerApi = async (email, password, fullName) => {
  const response = await axios.post(`${API}/auth/register`, { 
    email, password, fullName 
  });
  const { token } = response.data;
  localStorage.setItem('token', token);
  return response.data;
};

// Courses
export const getCourses = () => axios.get(`${API}/courses`);
export const createCourse = (title, description, price) => 
  axios.post(`${API}/courses`, { title, description, price });
export const getCourse = (id) => axios.get(`${API}/courses/${id}`);

// Logout
export const logout = () => {
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
};
