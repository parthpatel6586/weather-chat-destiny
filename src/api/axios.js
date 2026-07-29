import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_WEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5',
  timeout: 10000,
});

axiosInstance.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    appid: import.meta.env.VITE_WEATHER_API_KEY,
  };
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(new Error('Network error — please check your internet connection.'));
    }
    if (error.response.status === 404) {
      return Promise.reject(new Error('City not found..........................................'));
    }
    if (error.response.status === 401) {
      return Promise.reject(new Error('Invalid API key. Please check your Api.'));
    }
    return Promise.reject(new Error(error.response.data?.message || 'Something went wrong. Please try again.'));
  }
);

export default axiosInstance;
