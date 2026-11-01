import axios from 'axios';
const api = axios.create({ baseURL: 'http://localhost:8081/api/reports' });
export const getReportTemplates = async () => (await api.get('/templates')).data;
export const runReport = async (params) => (await api.get('', { params })).data;
export const getSavedReports = async () => (await api.get('/saved')).data;
export const saveReport = async (payload) => (await api.post('/saved', payload)).data;
export const deleteSavedReport = async (id) => (await api.delete(`/saved/${id}`)).data;
export const exportReport = async (params) => (await api.get('/export', { params, responseType: 'blob' })).data;
