
import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_BASE;

const api = axios.create({
  baseURL: API_BASE, 
  timeout: 60000
});

let isFirstRequest = true;
let slowWarningTimer = null;

api.interceptors.request.use((config) => {
  if (isFirstRequest) {
    slowWarningTimer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('serverWaking'));
    }, 5000);
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (isFirstRequest) {
      isFirstRequest = false;
      clearTimeout(slowWarningTimer);
      window.dispatchEvent(new CustomEvent('serverAwake'));
    }
    return response;
  },
  (error) => {
    clearTimeout(slowWarningTimer);
    window.dispatchEvent(new CustomEvent('serverAwake'));
    return Promise.reject(error);
  }
);

export default api;
