
import { useEffect, useState } from 'react';

import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Button,
  Snackbar,
  Chip,
  Stack,
} from '@mui/material';

import {
  getSalaryDirectory,
  getSalaryDirectorySummary,
  getEmployeesWithoutCurrentSalary,
  createSalaryRecord,
} from '../../api/salary';

import AddSalaryDialog from '../../components/salary/AddSalaryDialog';

const sectionPaperSx = {
  borderRadius: 3,
  border: '1px solid',
  borderColor: 'divider',
  boxShadow: '0 2px 12px rgba(15, 23, 42, 0.04)',
  overflow: 'hidden',
};

const tableHeaderSx = {
  backgroundColor: '#F8FAFC',
  color: 'text.secondary',
  fontWeight: 700,
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  whiteSpace: 'nowrap',
  py: 1.8,
};

function SummaryCard({ title, value, loading, subtitle }) {
  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 2px 12px rgba(15, 23, 42, 0.04)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 22px rgba(15, 23, 42, 0.08)',
        },
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Typography
          color="text.secondary"
          variant="body2"
          fontWeight={500}
        >
          {title}
        </Typography>

        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ mt: 1.5, color: 'text.primary' }}
        >
          {loading ? '...' : (value ?? 0).toLocaleString()}
        </Typography>

        {subtitle && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 1 }}
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

function SectionHeading({ title, description }) {
  return (
    <Box sx={{ px: 2.5, py: 2.5 }}>
      <Typography variant="h6" fontWeight={700}>
        {title}
      </Typography>

      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
}

export default function SalaryManagementPage() {
  // Salary directory state
  const [salaryData, setSalaryData] = useState({
    content: [],
    totalElements: 0,
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Summary state
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState('');

  // Employees without current salary state
  const [employeesWithoutSalary, setEmployeesWithoutSalary] = useState([]);
  const [missingSalaryLoading, setMissingSalaryLoading] = useState(true);
  const [missingSalaryError, setMissingSalaryError] = useState('');

  // Add salary dialog state
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [salaryDialogOpen, setSalaryDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [saveError, setSaveError] = useState('');

  // Fetch paginated salary directory
  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await getSalaryDirectory({
          page,
          size: rowsPerPage,
        });

        setSalaryData(data);
      } catch (err) {
        console.error('Failed to fetch salary directory:', err);
        setError('Unable to load salary records. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalaries();
  }, [page, rowsPerPage]);

  // Fetch salary summary
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setSummaryLoading(true);
        setSummaryError('');

        const data = await getSalaryDirectorySummary();
        setSummary(data);
      } catch (err) {
        console.error('Failed to fetch salary summary:', err);
        setSummaryError('Unable to load salary summary.');
      } finally {
        setSummaryLoading(false);
      }
    };

    fetchSummary();
  }, []);

  // Fetch active employees without current salary
  useEffect(() => {
    const fetchEmployeesWithoutSalary = async () => {
      try {
        setMissingSalaryLoading(true);
        setMissingSalaryError('');

        const data = await getEmployeesWithoutCurrentSalary();
        setEmployeesWithoutSalary(data);
      } catch (err) {
        console.error('Failed to fetch employees without salary:', err);
        setMissingSalaryError(
          'Unable to load employees without current salary.'
        );
      } finally {
        setMissingSalaryLoading(false);
      }
    };

    fetchEmployeesWithoutSalary();
  }, []);

  // Pagination handlers
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Open Add Salary dialog
  const handleOpenSalaryDialog = (employee) => {
    setSelectedEmployee(employee);
    setSaveError('');
    setSalaryDialogOpen(true);
  };

  // Close Add Salary dialog
  const handleCloseSalaryDialog = () => {
    setSalaryDialogOpen(false);
    setSelectedEmployee(null);
    setSaveError('');
  };

  // Submit new salary record
  const handleAddSalary = async (event) => {
    event.preventDefault();

    if (!selectedEmployee) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    const salaryData = {
      annualSalary: Number(formData.get('annualSalary')),
      currencyCode: formData.get('currencyCode'),
      effectiveFrom: formData.get('effectiveFrom'),
    };

    try {
      setSaveError('');

      await createSalaryRecord(
        selectedEmployee.employeeId,
        salaryData
      );

      handleCloseSalaryDialog();
      setSuccessMessage('Salary record added successfully.');

      const [
        directoryData,
        summaryData,
        missingSalaryData,
      ] = await Promise.all([
        getSalaryDirectory({
          page,
          size: rowsPerPage,
        }),
        getSalaryDirectorySummary(),
        getEmployeesWithoutCurrentSalary(),
      ]);

      setSalaryData(directoryData);
      setSummary(summaryData);
      setEmployeesWithoutSalary(missingSalaryData);
    } catch (err) {
      console.error('Failed to add salary:', err);

      setSaveError(
        err.response?.data?.message ||
        'Unable to add salary record. Please check the entered details.'
      );
    }
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* Page heading */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          fontWeight={800}
          letterSpacing="-0.5px"
        >
          Salary Management
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Manage employee compensation, salary records and revisions.
        </Typography>
      </Box>

      {/* Summary cards */}
      {summaryError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {summaryError}
        </Alert>
      )}

      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryCard
            title="Employees with Current Salary"
            value={summary?.employeesWithCurrentSalary}
            loading={summaryLoading}
            subtitle="Active employees with effective salary"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryCard
            title="Employees without Current Salary"
            value={summary?.employeesWithoutCurrentSalary}
            loading={summaryLoading}
            subtitle="Require salary attention"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryCard
            title="Countries Covered"
            value={summary?.countriesCovered}
            loading={summaryLoading}
            subtitle="Across the ACME workforce"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryCard
            title="Recent Salary Revisions"
            value={summary?.recentSalaryRevisions}
            loading={summaryLoading}
            subtitle="Recent compensation changes"
          />
        </Grid>
      </Grid>

      <Stack spacing={3}>
        {/* Current salary directory */}
        <Paper sx={sectionPaperSx}>
          <SectionHeading
            title="Current Salary Directory"
            description="View the currently effective annual compensation for employees."
          />

          {error && (
            <Alert severity="error" sx={{ mx: 2.5, mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 250,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {[
                        'Employee',
                        'Employee ID',
                        'Country',
                        'Department',
                        'Job Title',
                      ].map((heading) => (
                        <TableCell key={heading} sx={tableHeaderSx}>
                          {heading}
                        </TableCell>
                      ))}

                      <TableCell align="right" sx={tableHeaderSx}>
                        Annual Salary
                      </TableCell>

                      <TableCell sx={tableHeaderSx}>
                        Effective From
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {salaryData.content.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                          <Typography color="text.secondary">
                            No current salary records found.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      salaryData.content.map((employee) => (
                        <TableRow
                          key={employee.employeeId}
                          hover
                          sx={{
                            '&:last-child td': { borderBottom: 0 },
                          }}
                        >
                          <TableCell>
                            <Typography fontWeight={600} variant="body2">
                              {employee.firstName} {employee.lastName}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {employee.employeeCode}
                            </Typography>
                          </TableCell>

                          <TableCell>{employee.country}</TableCell>

                          <TableCell>{employee.department}</TableCell>

                          <TableCell>{employee.jobTitle}</TableCell>

                          <TableCell align="right">
                            <Typography fontWeight={600} variant="body2">
                              {new Intl.NumberFormat('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }).format(employee.annualSalary)}{' '}
                              {employee.currencyCode}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {employee.effectiveFrom}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={salaryData.totalElements}
                page={page}
                onPageChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[10, 25, 50]}
              />
            </>
          )}
        </Paper>

        {/* Employees without current salary */}
        <Paper sx={sectionPaperSx}>
          <SectionHeading
            title="Employees Without Current Salary"
            description="Active employees who do not have a salary effective today."
          />

          {missingSalaryError && (
            <Alert severity="error" sx={{ mx: 2.5, mb: 2 }}>
              {missingSalaryError}
            </Alert>
          )}

          {missingSalaryLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                p: 5,
              }}
            >
              <CircularProgress />
            </Box>
          ) : employeesWithoutSalary.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography fontWeight={600}>
                All active employees have a current salary.
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                There are no employees requiring salary attention.
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {[
                      'Employee',
                      'Employee ID',
                      'Country',
                      'Department',
                      'Job Title',
                      'Salary Status',
                    ].map((heading) => (
                      <TableCell key={heading} sx={tableHeaderSx}>
                        {heading}
                      </TableCell>
                    ))}

                    <TableCell align="right" sx={tableHeaderSx}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {employeesWithoutSalary.map((employee) => (
                    <TableRow
                      key={employee.employeeId}
                      hover
                      sx={{
                        '&:last-child td': { borderBottom: 0 },
                      }}
                    >
                      <TableCell>
                        <Typography fontWeight={600} variant="body2">
                          {employee.firstName} {employee.lastName}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {employee.employeeCode}
                        </Typography>
                      </TableCell>

                      <TableCell>{employee.country}</TableCell>

                      <TableCell>{employee.department}</TableCell>

                      <TableCell>{employee.jobTitle}</TableCell>

                      <TableCell>
                        {employee.hasFutureSalary ? (
                          <Box>
                            <Chip
                              label="Future Salary Scheduled"
                              size="small"
                              color="success"
                              sx={{
                                fontWeight: 600,
                                borderRadius: 1.5,
                              }}
                            />

                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: 'block', mt: 0.7 }}
                            >
                              Effective {employee.futureSalaryEffectiveFrom}
                            </Typography>
                          </Box>
                        ) : (
                          <Chip
                            label="No Salary Scheduled"
                            size="small"
                            color="default"
                            variant="outlined"
                            sx={{
                              fontWeight: 500,
                              borderRadius: 1.5,
                            }}
                          />
                        )}
                      </TableCell>

                      <TableCell align="right">
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleOpenSalaryDialog(employee)}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 2,
                          }}
                        >
                          Add Salary
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Stack>

      {/* Add Salary dialog */}
      <AddSalaryDialog
        open={salaryDialogOpen}
        employee={selectedEmployee}
        onClose={handleCloseSalaryDialog}
        onSubmit={handleAddSalary}
      />

      {/* Success notification */}
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage('')}
        message={successMessage}
      />

      {/* Salary submission error */}
      {saveError && (
        <Alert
          severity="error"
          sx={{ mt: 2 }}
          onClose={() => setSaveError('')}
        >
          {saveError}
        </Alert>
      )}
    </Box>
  );
}
