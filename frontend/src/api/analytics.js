import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api/analytics";

export const getPayrollSummary = async () => {
  const response = await axios.get(`${API_BASE_URL}/payroll-summary`);
  return response.data;
};

export const getHeadcountSummary = async () => {
  const response = await axios.get(`${API_BASE_URL}/headcount-summary`);
  return response.data;
};

export const getSalaryStatistics = async () => {
  const response = await axios.get(`${API_BASE_URL}/salary-statistics`);
  return response.data;
};