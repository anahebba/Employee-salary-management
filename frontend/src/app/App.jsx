import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import DashboardPage from '../features/dashboard/DashboardPage';
import EmployeesPage from '../features/employees/EmployeesPage';
import SalaryManagementPage from '../features/salary/SalaryManagementPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/salary-management" element={<SalaryManagementPage />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
