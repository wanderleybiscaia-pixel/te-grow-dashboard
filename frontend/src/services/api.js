import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('Erro na API:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error);
  }
);

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const uploadMultipleFiles = async (files) => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  return api.post('/upload/batch', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const getDashboardStats = async () => {
  return api.get('/dashboard/stats');
};

export const getDashboardData = async () => {
  return api.get('/dashboard/data');
};

export const getChartData = async (documentId, chartType) => {
  return api.get('/dashboard/charts', {
    params: { documentId, chartType }
  });
};

export default api;
