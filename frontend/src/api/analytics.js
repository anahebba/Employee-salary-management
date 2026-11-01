import axios from 'axios';
const api = axios.create({ baseURL: 'http://localhost:8081/api/analytics' });
export const getPayrollSummary = async () => (await api.get('/payroll-summary')).data;
export const getHeadcountSummary = async () => (await api.get('/headcount-summary')).data;
export const getSalaryStatistics = async () => (await api.get('/salary-statistics')).data;
export const getDashboardAnalytics = async (params = {}) => (await api.get('/dashboard', { params })).data;
