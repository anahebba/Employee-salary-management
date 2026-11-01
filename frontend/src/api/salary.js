import axios from 'axios';
const api = axios.create({ baseURL: 'http://localhost:8081/api' });
export const getSalaryHistory = async (employeeId) => (await api.get(`/employees/${employeeId}/salary-records`)).data;
export const createSalaryRecord = async (employeeId, salaryData) => (await api.post(`/employees/${employeeId}/salary-records`, salaryData)).data;
export const getSalaryDirectory = async (params = {}) => (await api.get('/salaries', { params })).data;
export const getSalaryDirectorySummary = async () => (await api.get('/salaries/summary')).data;
export const getEmployeesWithoutCurrentSalary = async () => (await api.get('/salaries/employees-without-current-salary')).data;
