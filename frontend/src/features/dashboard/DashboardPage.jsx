
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  getPayrollSummary,
  getHeadcountSummary,
  getSalaryStatistics,
  getDashboardAnalytics,
} from '../../api/analytics';

const formatNumber = (value) =>
  Number(value || 0).toLocaleString('en-US', {
    maximumFractionDigits: 0,
  });

const formatCurrency = (value, currencyCode) =>
  `${currencyCode || ''} ${Number(value || 0).toLocaleString('en-US', {
    maximumFractionDigits: 0,
  })}`.trim();

const getArray = (value) => (Array.isArray(value) ? value : []);

function KpiCard({ title, value, subtitle, icon: Icon }) {
  return (
    <Card sx={{ height: '100%', borderRadius: 3 }}>
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

            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
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
            <Icon />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function ChartCard({ title, subtitle, action, children }) {
  return (
    <Card sx={{ height: '100%', borderRadius: 3 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={1}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h6" fontWeight={650}>
              {title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {subtitle}
            </Typography>
          </Box>

          {action}
        </Stack>

        {children}
      </CardContent>
    </Card>
  );
}

function EmptyChart() {
  return (
    <Box
      sx={{
        height: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'text.secondary',
      }}
    >
      <Typography variant="body2">
        No data available for this selection.
      </Typography>
    </Box>
  );
}

export default function DashboardPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  const chartColors = theme.palette.chart || {};

  const [period, setPeriod] = useState('12M');
  const [country, setCountry] = useState('All');
  const [department, setDepartment] = useState('All');
  const [selectedStatisticsCountry, setSelectedStatisticsCountry] =
    useState('');

  const filters = useMemo(
    () => ({
      period,
      country: country === 'All' ? undefined : country,
      department: department === 'All' ? undefined : department,
    }),
    [period, country, department]
  );

  const {
    data: payrollSummary = [],
    isLoading: payrollLoading,
    isError: payrollError,
  } = useQuery({
    queryKey: ['payrollSummary'],
    queryFn: getPayrollSummary,
  });

  const {
    data: headcountSummary = [],
    isLoading: headcountLoading,
    isError: headcountError,
  } = useQuery({
    queryKey: ['headcountSummary'],
    queryFn: getHeadcountSummary,
  });

  const {
    data: salaryStatistics = [],
    isLoading: statisticsLoading,
    isError: statisticsError,
  } = useQuery({
    queryKey: ['salaryStatistics'],
    queryFn: getSalaryStatistics,
  });

  const {
    data: dashboardAnalytics = {},
    isLoading: dashboardLoading,
    isError: dashboardError,
  } = useQuery({
    queryKey: ['dashboardAnalytics', filters],
    queryFn: () => getDashboardAnalytics(filters),
  });

  const isLoading =
    payrollLoading ||
    headcountLoading ||
    statisticsLoading ||
    dashboardLoading;

  const hasError =
    payrollError ||
    headcountError ||
    statisticsError ||
    dashboardError;

  const filteredPayroll = useMemo(
    () =>
      getArray(payrollSummary).filter(
        (item) =>
          !(item.country === 'India' && item.currencyCode === 'GBP') &&
          (country === 'All' || item.country === country)
      ),
    [payrollSummary, country]
  );

  const filteredHeadcount = useMemo(
    () =>
      getArray(headcountSummary).filter(
        (item) =>
          (country === 'All' || item.country === country) &&
          (department === 'All' || item.department === department)
      ),
    [headcountSummary, country, department]
  );

  const filteredStatistics = useMemo(
    () =>
      getArray(salaryStatistics).filter(
        (item) =>
          !(item.country === 'India' && item.currencyCode === 'GBP') &&
          (country === 'All' || item.country === country)
      ),
    [salaryStatistics, country]
  );

  const countries = useMemo(
    () =>
      [
        ...new Set(
          getArray(headcountSummary)
            .map((item) => item.country)
            .filter(Boolean)
        ),
      ].sort(),
    [headcountSummary]
  );

  const departments = useMemo(
    () =>
      [
        ...new Set(
          getArray(headcountSummary)
            .map((item) => item.department)
            .filter(Boolean)
        ),
      ].sort(),
    [headcountSummary]
  );

  const activeEmployees = filteredHeadcount.reduce(
    (total, item) => total + Number(item.employeeCount || 0),
    0
  );

  const countriesCovered = new Set(
    filteredHeadcount.map((item) => item.country)
  ).size;

  const payrollGroups = filteredPayroll.length;

  const salaryTrend = getArray(
    dashboardAnalytics?.salaryTrend ??
      dashboardAnalytics?.data?.salaryTrend ??
      dashboardAnalytics?.trends?.salaryTrend
  );

  const salaryRevisions =
    dashboardAnalytics?.totalRevisions ??
    dashboardAnalytics?.salaryRevisions ??
    dashboardAnalytics?.revisionCount ??
    salaryTrend.reduce(
      (total, item) =>
        total +
        Number(
          item.revisionCount ??
            item.salaryRevisionCount ??
            item.revisions ??
            item.count ??
            item.total ??
            0
        ),
      0
    );

  const departmentHeadcount = useMemo(
    () =>
      filteredHeadcount.reduce((result, item) => {
        let entry = result.find(
          (row) => row.department === item.department
        );

        if (!entry) {
          entry = { department: item.department };
          result.push(entry);
        }

        entry[item.country] =
          (entry[item.country] || 0) +
          Number(item.employeeCount || 0);

        return result;
      }, []),
    [filteredHeadcount]
  );

  const statisticsCountries = filteredStatistics.map((item) => ({
    country: item.country,
    currencyCode: item.currencyCode,
  }));

  const activeStatisticsCountry =
    selectedStatisticsCountry &&
    statisticsCountries.some(
      (item) => item.country === selectedStatisticsCountry
    )
      ? selectedStatisticsCountry
      : statisticsCountries[0]?.country || '';

  const selectedStatistics = filteredStatistics.find(
    (item) => item.country === activeStatisticsCountry
  );

  const statisticsChartData = selectedStatistics
    ? [
        {
          metric: 'Average',
          value: Number(selectedStatistics.averageSalary || 0),
        },
        {
          metric: 'Median',
          value: Number(selectedStatistics.medianSalary || 0),
        },
        {
          metric: 'Minimum',
          value: Number(selectedStatistics.minimumSalary || 0),
        },
        {
          metric: 'Maximum',
          value: Number(selectedStatistics.maximumSalary || 0),
        },
      ]
    : [];

  const chartPalette = [
    chartColors.terracotta || '#A96F62',
    chartColors.sage || '#829B8D',
    chartColors.dustyBlue || '#858EAD',
    chartColors.ochre || '#BD9A68',
  ];

  const buildDrilldownUrl = (path, extra = {}) => {
    const params = new URLSearchParams();

    if (country !== 'All') params.set('country', country);
    if (department !== 'All') params.set('department', department);
    if (period !== 'All') params.set('period', period);

    Object.entries(extra).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    });

    const query = params.toString();
    navigate(query ? `${path}?${query}` : path);
  };

  const resetFilters = () => {
    setPeriod('12M');
    setCountry('All');
    setDepartment('All');
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: 350,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (hasError) {
    return (
      <Alert severity="error">
        Unable to load dashboard analytics. Please check that the backend is
        running and try again.
      </Alert>
    );
  }

  return (
    <Box>
      {/* PAGE HEADING */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" fontWeight={750}>
            HR Analytics Dashboard
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Organization-wide salary and workforce insights
          </Typography>
        </Box>

        {/* FILTERS BELOW HEADING */}
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
        >
          <FormControl size="small" sx={{ minWidth: 145 }}>
            <InputLabel>Time Period</InputLabel>
            <Select
              value={period}
              label="Time Period"
              onChange={(event) => setPeriod(event.target.value)}
            >
              <MenuItem value="3M">Last 3 months</MenuItem>
              <MenuItem value="6M">Last 6 months</MenuItem>
              <MenuItem value="12M">Last 12 months</MenuItem>
              <MenuItem value="All">All time</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 145 }}>
            <InputLabel>Country</InputLabel>
            <Select
              value={country}
              label="Country"
              onChange={(event) => setCountry(event.target.value)}
            >
              <MenuItem value="All">All Countries</MenuItem>
              {countries.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 155 }}>
            <InputLabel>Department</InputLabel>
            <Select
              value={department}
              label="Department"
              onChange={(event) => setDepartment(event.target.value)}
            >
              <MenuItem value="All">All Departments</MenuItem>
              {departments.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            size="small"
            variant="outlined"
            onClick={resetFilters}
            sx={{
              minWidth: 'auto',
              height: 40,
              px: 1.5,
              textTransform: 'none',
            }}
          >
            Reset Filters
          </Button>
        </Stack>
      </Box>

      {/* FOUR KPI CARDS */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard
            title="Active Employees"
            value={formatNumber(activeEmployees)}
            subtitle="Based on current filters"
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
            subtitle="Country and currency groups"
            icon={AccountBalanceOutlined}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard
            title="Salary Revisions"
            value={formatNumber(salaryRevisions)}
            subtitle="Recorded salary revisions"
            icon={InsightsOutlined}
          />
        </Grid>
      </Grid>

      {/* FOUR CHARTS */}
      <Grid container spacing={2.5}>
        {/* CHART 1 */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard
            title="Annual Payroll by Country"
            subtitle="Annual payroll in each country's local currency"
            action={
              <Button
                size="small"
                onClick={() => buildDrilldownUrl('/salary-management')}
              >
                View salaries
              </Button>
            }
          >
            {filteredPayroll.length === 0 ? (
              <EmptyChart />
            ) : (
              <Box sx={{ width: '100%', height: 330 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={filteredPayroll}
                    layout="vertical"
                    margin={{ top: 10, right: 25, left: 10, bottom: 10 }}
                    onClick={(state) => {
                      const selected =
                        state?.activePayload?.[0]?.payload;

                      if (selected?.country) {
                        buildDrilldownUrl('/salary-management', {
                          country: selected.country,
                        });
                      }
                    }}
                  >
                    <CartesianGrid
                      stroke="#E9E2DC"
                      strokeDasharray="3 3"
                      horizontal={false}
                    />
                    <XAxis type="number" tickFormatter={formatNumber} />
                    <YAxis type="category" dataKey="country" width={85} />
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
                      fill={chartPalette[0]}
                      radius={[0, 6, 6, 0]}
                      barSize={24}
                      cursor="pointer"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
          </ChartCard>
        </Grid>

        {/* CHART 2 */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard
            title="Employee Headcount by Department"
            subtitle="Active employee distribution across departments"
            action={
              <Button
                size="small"
                onClick={() => buildDrilldownUrl('/employees')}
              >
                View employees
              </Button>
            }
          >
            {departmentHeadcount.length === 0 ? (
              <EmptyChart />
            ) : (
              <Box sx={{ width: '100%', height: 330 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={departmentHeadcount}
                    margin={{ top: 10, right: 15, left: 0, bottom: 45 }}
                    onClick={(state) => {
                      const selected =
                        state?.activePayload?.[0]?.payload;

                      if (selected?.department) {
                        buildDrilldownUrl('/employees', {
                          department: selected.department,
                        });
                      }
                    }}
                  >
                    <CartesianGrid
                      stroke="#E9E2DC"
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="department"
                      angle={-25}
                      textAnchor="end"
                      interval={0}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      formatter={(value) => [
                        formatNumber(value),
                        'Employees',
                      ]}
                    />
                    <Legend />
                    {countries.map((item, index) => (
                      <Bar
                        key={item}
                        dataKey={item}
                        name={item}
                        stackId="countries"
                        fill={chartPalette[index % chartPalette.length]}
                        cursor="pointer"
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
          </ChartCard>
        </Grid>

        {/* CHART 3 */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard
            title="Salary Revision Trend"
            subtitle="Salary revisions recorded over time"
            action={
              <Button
                size="small"
                onClick={() => buildDrilldownUrl('/salary-management')}
              >
                View revisions
              </Button>
            }
          >
            {salaryTrend.length === 0 ? (
              <EmptyChart />
            ) : (
              <Box sx={{ width: '100%', height: 330 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={salaryTrend}
                    margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                    onClick={(state) => {
                      const selected =
                        state?.activePayload?.[0]?.payload;

                      if (selected) {
                        buildDrilldownUrl('/salary-management', {
                          date:
                            selected.month ??
                            selected.period ??
                            selected.date,
                        });
                      }
                    }}
                  >
                    <CartesianGrid
                      stroke="#E9E2DC"
                      strokeDasharray="3 3"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      formatter={(value) => [
                        formatNumber(value),
                        'Revisions',
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="revisionCount"
                      name="Salary Revisions"
                      stroke={chartPalette[0]}
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 7, cursor: 'pointer' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            )}
          </ChartCard>
        </Grid>

        {/* CHART 4 */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard
            title="Salary Statistics by Country"
            subtitle={
              selectedStatistics
                ? `Annual salary values in ${selectedStatistics.currencyCode}`
                : 'Average, median, minimum and maximum annual salary'
            }
            action={
              <FormControl size="small" sx={{ minWidth: 125 }}>
                <InputLabel>Country</InputLabel>
                <Select
                  value={activeStatisticsCountry}
                  label="Country"
                  onChange={(event) =>
                    setSelectedStatisticsCountry(event.target.value)
                  }
                >
                  {statisticsCountries.map((item) => (
                    <MenuItem key={item.country} value={item.country}>
                      {item.country}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            }
          >
            {!selectedStatistics ? (
              <EmptyChart />
            ) : (
              <Box sx={{ width: '100%', height: 330 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={statisticsChartData}
                    margin={{ top: 15, right: 15, left: 5, bottom: 10 }}
                    onClick={() =>
                      buildDrilldownUrl('/reports', {
                        country: activeStatisticsCountry,
                      })
                    }
                  >
                    <CartesianGrid
                      stroke="#E9E2DC"
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis dataKey="metric" />
                    <YAxis tickFormatter={formatNumber} />
                    <Tooltip
                      formatter={(value) => [
                        formatCurrency(
                          value,
                          selectedStatistics.currencyCode
                        ),
                        'Annual Salary',
                      ]}
                    />
                    <Bar
                      dataKey="value"
                      name="Annual Salary"
                      fill={chartPalette[1]}
                      radius={[6, 6, 0, 0]}
                      barSize={42}
                      cursor="pointer"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
}
