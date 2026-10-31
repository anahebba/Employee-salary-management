
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  CircularProgress,
  Alert,
  Avatar,
  Stack,
   Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Snackbar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import { getEmployees } from '../../api/employees';
import AddIcon from '@mui/icons-material/Add';
import EmployeeForm from '../../components/employees/EmployeeForm';
import { createEmployee } from '../../api/employees';


export default function EmployeesPage() {
  const [search, setSearch] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalEmployees, setTotalEmployees] = useState(0);

  const [openForm, setOpenForm] = useState(false);
const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await getEmployees({
          page,
          size: rowsPerPage,
        });

        setEmployees(data.content);
        setTotalEmployees(data.totalElements);
      } catch (err) {
        console.error('Failed to fetch employees:', err);
        setError('Unable to load employees. Please check whether the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [page, rowsPerPage]);

  const filteredEmployees = employees.filter((employee) =>
    `${employee.firstName} ${employee.lastName} ${employee.email} ${employee.department} ${employee.jobTitle}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const getInitials = (employee) =>
    `${employee.firstName?.[0] || ''}${employee.lastName?.[0] || ''}`.toUpperCase();


  const handleCreateEmployee = async (employeeData) => {
  try {
    await createEmployee(employeeData);

    setOpenForm(false);
    setSuccessMessage('Employee created successfully!');

    // Refresh the current page
    const data = await getEmployees({
      page,
      size: rowsPerPage,
    });

    setEmployees(data.content);
    setTotalEmployees(data.totalElements);
  } catch (err) {
    console.error('Failed to create employee:', err);
    setError(
      err.response?.data?.message || 'Unable to create employee.'
    );
  }
};

  return (
    <Box sx={{ maxWidth: 1500, mx: 'auto' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            <Stack
  direction="row"
  justifyContent="space-between"
  alignItems="center"
  sx={{ mb: 3 }}
>
  <Box>
    <Typography variant="h4" gutterBottom>
      Employees
    </Typography>

    <Typography color="text.secondary">
      Manage employee information and salary records here.
    </Typography>
  </Box>

  <Button
    variant="contained"
    startIcon={<AddIcon />}
    onClick={() => setOpenForm(true)}
  >
    Add Employee
  </Button>
</Stack>
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Manage and view your organization's employee information.
          </Typography>
        </Box>

        <Chip
          icon={<GroupsOutlinedIcon />}
          label={`${totalEmployees.toLocaleString()} Employees`}
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 600, px: 1 }}
        />
      </Stack>

      <Paper
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 2.5 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Search employees on this page..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{ maxWidth: 420 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Box sx={{ px: 2.5, pb: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {!loading && !error && (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'action.hover' }}>
                    {[
                      'EMPLOYEE',
                      'EMPLOYEE ID',
                      'COUNTRY',
                      'DEPARTMENT',
                      'JOB TITLE',
                      'STATUS',
                    ].map((heading) => (
                      <TableCell
                        key={heading}
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          letterSpacing: '0.06em',
                          color: 'text.secondary',
                          py: 2,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {heading}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow
                      key={employee.id}
                      hover
                      sx={{
                        '& td': {
                          py: 1.8,
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                        },
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Avatar
                            sx={{
                              width: 38,
                              height: 38,
                              bgcolor: 'primary.light',
                              color: 'primary.dark',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                            }}
                          >
                            {getInitials(employee)}
                          </Avatar>

                          <Box>
                            <Typography fontWeight={600} fontSize="0.875rem">
                              {employee.firstName} {employee.lastName}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontSize="0.78rem"
                            >
                              {employee.email}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Typography fontWeight={600} fontSize="0.82rem">
                          {employee.employeeCode}
                        </Typography>
                      </TableCell>

                      <TableCell>{employee.country}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.jobTitle}</TableCell>

                      <TableCell>
                        <Chip
                          label={
                            employee.employmentStatus === 'ACTIVE'
                              ? 'Active'
                              : 'Inactive'
                          }
                          size="small"
                          color={
                            employee.employmentStatus === 'ACTIVE'
                              ? 'success'
                              : 'default'
                          }
                          sx={{
                            fontWeight: 600,
                            minWidth: 75,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}

                  {filteredEmployees.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                        <Typography color="text.secondary">
                          No employees found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={totalEmployees}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[10, 25, 50, 100]}
            />
          </>
        )}
      </Paper>
      <Dialog
  open={openForm}
  onClose={() => setOpenForm(false)}
  fullWidth
  maxWidth="sm"
>
  <DialogTitle>Add New Employee</DialogTitle>

  <DialogContent dividers>
    <EmployeeForm
      onSubmit={handleCreateEmployee}
      onCancel={() => setOpenForm(false)}
    />
  </DialogContent>
</Dialog>

<Snackbar
  open={Boolean(successMessage)}
  autoHideDuration={4000}
  message={successMessage}
  onClose={() => setSuccessMessage('')}
/>
    </Box>
  );
}
