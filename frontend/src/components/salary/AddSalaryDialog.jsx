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
  title = "Add Salary",
  defaultReason = "INITIAL",
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>

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
            name="revisionReason"
            label="Reason for change"
            select
            defaultValue={defaultReason}
            required
            fullWidth
          >
            <MenuItem value="INITIAL">Initial salary</MenuItem>
            <MenuItem value="PROMOTION">Promotion</MenuItem>
            <MenuItem value="ANNUAL_INCREMENT">Annual increment</MenuItem>
            <MenuItem value="MARKET_ADJUSTMENT">Market adjustment</MenuItem>
            <MenuItem value="ROLE_CHANGE">Role change</MenuItem>
            <MenuItem value="CORRECTION">Correction</MenuItem>
            <MenuItem value="OTHER">Other</MenuItem>
          </TextField>

          <TextField
            name="revisionNotes"
            label="Notes (optional)"
            multiline
            minRows={2}
            fullWidth
            inputProps={{ maxLength: 500 }}
          />

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