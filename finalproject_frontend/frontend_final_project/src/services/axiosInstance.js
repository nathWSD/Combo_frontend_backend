import axios from 'axios';

const token = localStorage.getItem('token');
const axiosInstance = axios.create();
axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;


// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
   
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
