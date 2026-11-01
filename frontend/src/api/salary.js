import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
});

// Fetch salary history for a particular employee.
export const getSalaryHistory = async (employeeId) => {
  const response = await api.get(
    `/employees/${employeeId}/salary-records`
  );

  return response.data;
};

// Add a new salary record for an employee.
export const createSalaryRecord = async (employeeId, salaryData) => {
  const response = await api.post(
    `/employees/${employeeId}/salary-records`,
    salaryData
  );

  return response.data;
};
// Fetch the paginated salary directory.
export const getSalaryDirectory = async (params = {}) => {
  const response = await api.get('/salaries', { params });
  return response.data;
};
// Fetch company-wide salary summary metrics.
export const getSalaryDirectorySummary = async () => {
  const response = await api.get('/salaries/summary');
  return response.data;
};
export const getEmployeesWithoutCurrentSalary = async () => {
  const response = await api.get(
    '/salaries/employees-without-current-salary'
  );
  return response.data;
};