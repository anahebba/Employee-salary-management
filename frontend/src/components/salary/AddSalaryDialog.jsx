import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  MenuItem,
  Button,
  Box,
} from '@mui/material';

export default function AddSalaryDialog({
  open,
  employee,
  onClose,
  onSubmit,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Salary</DialogTitle>

      <DialogContent>
        {employee && (
          <Box sx={{ mb: 3, mt: 1 }}>
            <Typography fontWeight={700}>
              {employee.firstName} {employee.lastName}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {employee.employeeCode} · {employee.country} · {employee.department}
            </Typography>
          </Box>
        )}

        <Box
          component="form"
          id="add-salary-form"
          onSubmit={onSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            name="annualSalary"
            label="Annual Salary"
            type="number"
            required
            fullWidth
            inputProps={{ min: 0.01, step: 0.01 }}
          />

          <TextField
            name="currencyCode"
            label="Currency"
            select
            defaultValue=""
            required
            fullWidth
          >
            <MenuItem value="INR">INR - Indian Rupee</MenuItem>
            <MenuItem value="USD">USD - US Dollar</MenuItem>
            <MenuItem value="GBP">GBP - British Pound</MenuItem>
            <MenuItem value="EUR">EUR - Euro</MenuItem>
          </TextField>

          <TextField
            name="effectiveFrom"
            label="Effective From"
            type="date"
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>

        <Button
          type="submit"
          form="add-salary-form"
          variant="contained"
        >
          Save Salary
        </Button>
      </DialogActions>
    </Dialog>
  );
}