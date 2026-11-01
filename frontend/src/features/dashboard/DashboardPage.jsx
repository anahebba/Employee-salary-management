
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@mui/material/styles';

import {
  AccountBalanceOutlined,
  GroupsOutlined,
  InsightsOutlined,
  PublicOutlined,
} from '@mui/icons-material';

import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from '@mui/material';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  getPayrollSummary,
  getHeadcountSummary,
  getSalaryStatistics,
} from '../../api/analytics';

// Consistent number formatting across charts and KPI values.
const formatNumber = (value) =>
  Number(value).toLocaleString('en-US', {
    maximumFractionDigits: 0,
  });

// Consistent currency formatting.
const formatCurrency = (value, currencyCode) =>
  `${currencyCode} ${Number(value).toLocaleString('en-US', {
    maximumFractionDigits: 0,
  })}`;

// Reusable KPI card component.
function KpiCard({ title, value, subtitle, icon: Icon }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography color="text.secondary" variant="body2">
              {title}
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ mt: 1, mb: 0.5 }}
            >
              {value}
            </Typography>

            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 46,
              height: 46,
              borderRadius: 2,
              bgcolor: 'primary.light',
              color: 'primary.main',
            }}
          >
            <Icon fontSize="medium" />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

// Reusable chart card component.
function ChartCard({ title, subtitle, children }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5, mb: 2 }}
          >
            {subtitle}
          </Typography>
        )}

        {children}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  // Access the centralized MUI theme colours.
  const theme = useTheme();
  const chartColors = theme.palette.chart;

  // Fetch payroll summary.
  const {
    data: payrollSummary = [],
    isLoading: isPayrollLoading,
    isError: isPayrollError,
    error: payrollError,
  } = useQuery({
    queryKey: ['payrollSummary'],
    queryFn: getPayrollSummary,
  });

  // Fetch employee headcount.
  const {
    data: headcountSummary = [],
    isLoading: isHeadcountLoading,
    isError: isHeadcountError,
  } = useQuery({
    queryKey: ['headcountSummary'],
    queryFn: getHeadcountSummary,
  });

  // Fetch salary statistics.
  const {
    data: salaryStatistics = [],
    isLoading: isSalaryLoading,
    isError: isSalaryError,
  } = useQuery({
    queryKey: ['salaryStatistics'],
    queryFn: getSalaryStatistics,
  });

  // Display a loading indicator until all three APIs respond.
  if (isPayrollLoading || isHeadcountLoading || isSalaryLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 300,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Display an error if any analytics API fails.
  if (isPayrollError || isHeadcountError || isSalaryError) {
    return (
      <Alert severity="error">
        Failed to load dashboard analytics.{' '}
        {payrollError?.message || 'Please check the backend and try again.'}
      </Alert>
    );
  }

  // Exclude the inconsistent India + GBP combination for now.
  const filteredPayrollSummary = payrollSummary.filter(
    (item) =>
      !(item.country === 'India' && item.currencyCode === 'GBP')
  );

  const filteredSalaryStatistics = salaryStatistics.filter(
    (item) =>
      !(item.country === 'India' && item.currencyCode === 'GBP')
  );

  // Calculate KPI values from the API responses.
  const activeEmployees = headcountSummary.reduce(
    (total, item) => total + Number(item.employeeCount),
    0
  );

  const countriesCovered = new Set(
    headcountSummary.map((item) => item.country)
  ).size;

  const payrollGroups = filteredPayrollSummary.length;
  const salaryGroups = filteredSalaryStatistics.length;

  // Transform headcount data for the stacked bar chart.
  const departmentHeadcount = headcountSummary.reduce(
    (result, item) => {
      let department = result.find(
        (entry) => entry.department === item.department
      );

      if (!department) {
        department = {
          department: item.department,
        };

        result.push(department);
      }

      department[item.country] = Number(item.employeeCount);

      return result;
    },
    []
  );

  return (
    <Box>
      {/* PAGE INTRODUCTION */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          HR Analytics Dashboard
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Organization-wide salary and workforce insights
        </Typography>
      </Box>

      {/* KPI CARDS */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard
            title="Active Employees"
            value={formatNumber(activeEmployees)}
            subtitle="Across the organization"
            icon={GroupsOutlined}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard
            title="Countries Covered"
            value={formatNumber(countriesCovered)}
            subtitle="Countries with employees"
            icon={PublicOutlined}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard
            title="Payroll Groups"
            value={formatNumber(payrollGroups)}
            subtitle="Separate country currencies"
            icon={AccountBalanceOutlined}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard
            title="Salary Groups"
            value={formatNumber(salaryGroups)}
            subtitle="Country and currency combinations"
            icon={InsightsOutlined}
          />
        </Grid>
      </Grid>

      {/* PAYROLL AND HEADCOUNT CHARTS */}
      <Grid container spacing={2.5}>
        {/* ANNUAL PAYROLL */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard
            title="Annual Payroll by Country"
            subtitle="Annual payroll totals in each country's local currency"
          >
            <Box sx={{ width: '100%', height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredPayrollSummary}
                  layout="vertical"
                  margin={{ top: 10, right: 25, left: 10, bottom: 10 }}
                >
                  <CartesianGrid
                    stroke="#E9E2DC"
                    strokeDasharray="3 3"
                    horizontal={false}
                  />

                  <XAxis
                    type="number"
                    tickFormatter={formatNumber}
                    tick={{ fontSize: 12, fill: '#77716B' }}
                  />

                  <YAxis
                    type="category"
                    dataKey="country"
                    width={85}
                    tick={{ fontSize: 12, fill: '#77716B' }}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E9E2DC',
                      borderRadius: 10,
                    }}
                    formatter={(value, name, item) => [
                      formatCurrency(
                        value,
                        item.payload.currencyCode
                      ),
                      'Annual Payroll',
                    ]}
                  />

                  <Bar
                    dataKey="totalAnnualPayroll"
                    name="Annual Payroll"
                    fill={chartColors.terracotta}
                    radius={[0, 6, 6, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </ChartCard>
        </Grid>

        {/* EMPLOYEE HEADCOUNT */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard
            title="Employee Headcount by Department"
            subtitle="Active employee distribution across departments and countries"
          >
            <Box sx={{ width: '100%', height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentHeadcount}
                  margin={{ top: 10, right: 15, left: 0, bottom: 45 }}
                >
                  <CartesianGrid
                    stroke="#E9E2DC"
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="department"
                    tick={{ fontSize: 11, fill: '#77716B' }}
                    angle={-25}
                    textAnchor="end"
                    interval={0}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: '#77716B' }}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E9E2DC',
                      borderRadius: 10,
                    }}
                    formatter={(value) => [
                      formatNumber(value),
                      'Employees',
                    ]}
                  />

                  <Legend />

                  <Bar
                    dataKey="Germany"
                    stackId="countries"
                    fill={chartColors.terracotta}
                  />

                  <Bar
                    dataKey="India"
                    stackId="countries"
                    fill={chartColors.sage}
                  />

                  <Bar
                    dataKey="UK"
                    stackId="countries"
                    fill={chartColors.dustyBlue}
                  />

                  <Bar
                    dataKey="USA"
                    stackId="countries"
                    fill={chartColors.ochre}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </ChartCard>
        </Grid>
      </Grid>

      {/* SALARY STATISTICS */}
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          Salary Statistics by Country
        </Typography>

        <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
          Average, median, minimum and maximum annual salaries in local currency
        </Typography>
      </Box>

      <Grid container spacing={2.5}>
        {filteredSalaryStatistics.map((item) => (
          <Grid
            key={`${item.country}-${item.currencyCode}`}
            size={{ xs: 12, md: 6 }}
          >
            <ChartCard
              title={`${item.country} (${item.currencyCode})`}
              subtitle="Annual salary comparison"
            >
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        metric: 'Annual Salary',
                        Average: Number(item.averageSalary),
                        Median: Number(item.medianSalary),
                        Minimum: Number(item.minimumSalary),
                        Maximum: Number(item.maximumSalary),
                      },
                    ]}
                    margin={{ top: 15, right: 10, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid
                      stroke="#E9E2DC"
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="metric"
                      tick={{ fontSize: 12, fill: '#77716B' }}
                    />

                    <YAxis
                      tickFormatter={formatNumber}
                      width={85}
                      tick={{ fontSize: 11, fill: '#77716B' }}
                    />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E9E2DC',
                        borderRadius: 10,
                      }}
                      formatter={(value, name) => [
                        formatCurrency(value, item.currencyCode),
                        name,
                      ]}
                    />

                    <Legend />

                    <Bar
                      dataKey="Average"
                      fill={chartColors.terracotta}
                      radius={[4, 4, 0, 0]}
                    />

                    <Bar
                      dataKey="Median"
                      fill={chartColors.sage}
                      radius={[4, 4, 0, 0]}
                    />

                    <Bar
                      dataKey="Minimum"
                      fill={chartColors.dustyBlue}
                      radius={[4, 4, 0, 0]}
                    />

                    <Bar
                      dataKey="Maximum"
                      fill={chartColors.ochre}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </ChartCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
