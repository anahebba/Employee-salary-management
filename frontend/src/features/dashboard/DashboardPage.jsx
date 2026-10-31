
import { useQuery } from '@tanstack/react-query';

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

  // Calculate KPI values from the API responses.
  const activeEmployees = headcountSummary.reduce(
    (total, item) => total + Number(item.employeeCount),
    0
  );

  const countriesCovered = new Set(
    headcountSummary.map((item) => item.country)
  ).size;

  const payrollGroups = payrollSummary.length;
  const salaryGroups = salaryStatistics.length;

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
        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard
            title="Annual Payroll by Country"
            subtitle="Annual payroll totals in each country's local currency"
          >
            <Box sx={{ width: '100%', height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={payrollSummary}
                  layout="vertical"
                  margin={{ top: 10, right: 25, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />

                  <XAxis
                    type="number"
                    tickFormatter={formatNumber}
                    tick={{ fontSize: 12 }}
                  />

                  <YAxis
                    type="category"
                    dataKey="country"
                    width={85}
                    tick={{ fontSize: 12 }}
                  />

                  <Tooltip
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
                    fill="#2563EB"
                    radius={[0, 6, 6, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard
            title="Employee Headcount by Department"
            subtitle="Active employee distribution across departments and countries"
          >
            <Box sx={{ width: '100%', height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={headcountSummary}
                  margin={{ top: 10, right: 15, left: 0, bottom: 45 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />

                  <XAxis
                    dataKey="department"
                    tick={{ fontSize: 11 }}
                    angle={-25}
                    textAnchor="end"
                    interval={0}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12 }}
                  />

                  <Tooltip
                    formatter={(value) => [
                      formatNumber(value),
                      'Employees',
                    ]}
                    labelFormatter={(label, payload) =>
                      payload?.[0]?.payload?.country
                        ? `${label} — ${payload[0].payload.country}`
                        : label
                    }
                  />

                  <Legend />

                  <Bar
                    dataKey="employeeCount"
                    name="Employees"
                    fill="#16A34A"
                    radius={[5, 5, 0, 0]}
                    barSize={28}
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
        {salaryStatistics.map((item) => (
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
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />

                    <XAxis
                      dataKey="metric"
                      tick={{ fontSize: 12 }}
                    />

                    <YAxis
                      tickFormatter={formatNumber}
                      width={85}
                      tick={{ fontSize: 11 }}
                    />

                    <Tooltip
                      formatter={(value, name) => [
                        formatCurrency(value, item.currencyCode),
                        name,
                      ]}
                    />

                    <Legend />

                    <Bar
                      dataKey="Average"
                      fill="#2563EB"
                      radius={[4, 4, 0, 0]}
                    />

                    <Bar
                      dataKey="Median"
                      fill="#16A34A"
                      radius={[4, 4, 0, 0]}
                    />

                    <Bar
                      dataKey="Minimum"
                      fill="#EA580C"
                      radius={[4, 4, 0, 0]}
                    />

                    <Bar
                      dataKey="Maximum"
                      fill="#9333EA"
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
