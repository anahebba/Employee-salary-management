import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
});

export const getEmployees = async (params = {}) => {
  const response = await api.get('/employees', { params });
  return response.data;
};
