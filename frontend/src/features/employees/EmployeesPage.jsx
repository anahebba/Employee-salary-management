
import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';

import EmployeeForm from '../../components/employees/EmployeeForm';

import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deactivateEmployee,
} from '../../api/employees';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalEmployees, setTotalEmployees] = useState(0);

  const [openForm, setOpenForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuEmployee, setMenuEmployee] = useState(null);

  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [employeeToUpdate, setEmployeeToUpdate] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getEmployees({
        page,
        size: rowsPerPage,
        search: debouncedSearch.trim() || undefined,
      });

      setEmployees(data.content);
      setTotalEmployees(data.totalElements);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      setError(
        err.response?.data?.message || 'Unable to load employees.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search);
  }, 400);

  return () => clearTimeout(timer);
}, [search]);

  useEffect(() => {
    fetchEmployees();
  }, [page, rowsPerPage, debouncedSearch]);

  const handleOpenCreateForm = () => {
    setSelectedEmployee(null);
    setOpenForm(true);
  };

  const handleOpenEditForm = (employee) => {
    setSelectedEmployee(employee);
    setOpenForm(true);
    handleCloseMenu();
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedEmployee(null);
  };

  const handleCreateEmployee = async (employeeData) => {
    try {
      await createEmployee(employeeData);

      handleCloseForm();
      setSuccessMessage('Employee created successfully!');

      if (page !== 0) {
        setPage(0);
      } else {
        await fetchEmployees();
      }
    } catch (err) {
      console.error('Failed to create employee:', err);
      setError(
        err.response?.data?.message || 'Unable to create employee.',
      );
    }
  };

  const handleUpdateEmployee = async (employeeData) => {
    try {
      await updateEmployee(selectedEmployee.id, employeeData);

      handleCloseForm();
      setSuccessMessage('Employee updated successfully!');
      await fetchEmployees();
    } catch (err) {
      console.error('Failed to update employee:', err);
      setError(
        err.response?.data?.message || 'Unable to update employee.',
      );
    }
  };

  const handleOpenMenu = (event, employee) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuEmployee(employee);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setMenuEmployee(null);
  };

  const handleOpenStatusDialog = (employee) => {
    setEmployeeToUpdate(employee);
    setOpenStatusDialog(true);
    handleCloseMenu();
  };

  const handleCloseStatusDialog = () => {
    if (updatingStatus) return;

    setOpenStatusDialog(false);
    setEmployeeToUpdate(null);
  };

  const handleConfirmStatusChange = async () => {
    if (!employeeToUpdate) return;

    try {
      setUpdatingStatus(true);

      if (employeeToUpdate.employmentStatus === 'ACTIVE') {
        await deactivateEmployee(
          employeeToUpdate.id,
          employeeToUpdate,
        );
        setSuccessMessage('Employee deactivated successfully!');
      } else {
        await updateEmployee(employeeToUpdate.id, {
          ...employeeToUpdate,
          employmentStatus: 'ACTIVE',
        });
        setSuccessMessage('Employee reactivated successfully!');
      }

      setOpenStatusDialog(false);
      setEmployeeToUpdate(null);

      await fetchEmployees();
    } catch (err) {
      console.error('Failed to update employee status:', err);
      setError(
        err.response?.data?.message ||
          'Unable to update employee status.',
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  return (
    <Box>
      {/* Page title and Add Employee button */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Employees
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage employee information and employment status
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="medium"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateForm}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            px: 2,
            whiteSpace: 'nowrap',
          }}
        >
          Add Employee
        </Button>
      </Stack>

      {/* Search */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 2.5,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search employees..."
          value={search}
          onChange={handleSearchChange}
        />
      </Paper>

      {/* Employee table */}
      <Paper
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={250}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'action.hover' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Employee ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Country</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Job Title</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {employees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                        <Typography color="text.secondary">
                          No employees found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    employees.map((employee) => (
                      <TableRow
                        key={employee.id}
                        hover
                        sx={{
                          '&:last-child td': { borderBottom: 0 },
                        }}
                      >
                        <TableCell>
                          <Typography fontWeight={600}>
                            {employee.firstName} {employee.lastName}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {employee.email}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          {employee.employeeCode}
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
                            color={
                              employee.employmentStatus === 'ACTIVE'
                                ? 'success'
                                : 'default'
                            }
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>

                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={(event) =>
                              handleOpenMenu(event, employee)
                            }
                            aria-label={`Actions for ${employee.firstName}`}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
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

      {/* Three-dot employee actions menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
      >
        {menuEmployee && (
          <>
            <MenuItem
              onClick={() => handleOpenEditForm(menuEmployee)}
            >
              <EditOutlinedIcon
                fontSize="small"
                sx={{ mr: 1.5 }}
              />
              Edit employee
            </MenuItem>

            <MenuItem
              onClick={() =>
                handleOpenStatusDialog(menuEmployee)
              }
              sx={{
                color:
                  menuEmployee.employmentStatus === 'ACTIVE'
                    ? 'error.main'
                    : 'success.main',
              }}
            >
              {menuEmployee.employmentStatus === 'ACTIVE' ? (
                <>
                  <PersonOffOutlinedIcon
                    fontSize="small"
                    sx={{ mr: 1.5 }}
                  />
                  Deactivate employee
                </>
              ) : (
                <>
                  <PersonAddAltOutlinedIcon
                    fontSize="small"
                    sx={{ mr: 1.5 }}
                  />
                  Reactivate employee
                </>
              )}
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Create/Edit employee dialog */}
      <Dialog
        open={openForm}
        onClose={handleCloseForm}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {selectedEmployee ? 'Edit Employee' : 'Add Employee'}
        </DialogTitle>

        <DialogContent dividers>
          <EmployeeForm
            key={selectedEmployee?.id || 'new'}
            initialData={selectedEmployee || undefined}
            onSubmit={
              selectedEmployee
                ? handleUpdateEmployee
                : handleCreateEmployee
            }
            onCancel={handleCloseForm}
            submitLabel={
              selectedEmployee ? 'Update Employee' : 'Save Employee'
            }
          />
        </DialogContent>
      </Dialog>

      {/* Deactivate/Reactivate confirmation dialog */}
      <Dialog
        open={openStatusDialog}
        onClose={handleCloseStatusDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {employeeToUpdate?.employmentStatus === 'ACTIVE'
            ? 'Deactivate Employee?'
            : 'Reactivate Employee?'}
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            {employeeToUpdate?.employmentStatus === 'ACTIVE'
              ? `Are you sure you want to deactivate ${employeeToUpdate?.firstName} ${employeeToUpdate?.lastName}? They will no longer be considered an active employee.`
              : `Are you sure you want to reactivate ${employeeToUpdate?.firstName} ${employeeToUpdate?.lastName}?`}
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseStatusDialog}
            disabled={updatingStatus}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color={
              employeeToUpdate?.employmentStatus === 'ACTIVE'
                ? 'error'
                : 'success'
            }
            onClick={handleConfirmStatusChange}
            disabled={updatingStatus}
          >
            {updatingStatus
              ? 'Please wait...'
              : employeeToUpdate?.employmentStatus === 'ACTIVE'
                ? 'Deactivate'
                : 'Reactivate'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success notification */}
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSuccessMessage('')}
          severity="success"
          variant="filled"
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
