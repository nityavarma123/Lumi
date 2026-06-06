import axios from 'axios';

const client = axios.create({ baseURL: '/api', timeout: 15000 });

// Attach token to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('limu_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Consistent error handling
client.interceptors.response.use(
  (res) => res.data.data ?? res.data,
  (err) => {
    const message = err.response?.data?.message || err.message || 'Something went wrong';
    if (err.response?.status === 401) {
      localStorage.removeItem('limu_token');
      localStorage.removeItem('limu_user');
      window.location.href = '/';
    }
    return Promise.reject(new Error(message));
  }
);

export default client;
