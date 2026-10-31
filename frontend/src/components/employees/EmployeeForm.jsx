
import { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Stack,
  Typography,
} from '@mui/material';

const initialFormData = {
  firstName: '',
  lastName: '',
  email: '',
  country: '',
  department: '',
  jobTitle: '',
  employmentStatus: 'ACTIVE',
  hireDate: '',
};

export default function EmployeeForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
     console.log('Employee form data:', formData);
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
        Employee Information
      </Typography>

      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            required
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            required
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </Stack>

        <TextField
          fullWidth
          required
          type="email"
          label="Email Address"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          required
          select
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
        >
          {['India', 'USA', 'UK', 'Germany'].map((country) => (
            <MenuItem key={country} value={country}>
              {country}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          required
          select
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleChange}
        >
          {['Engineering', 'Finance', 'Human Resources', 'Marketing'].map(
            (department) => (
              <MenuItem key={department} value={department}>
                {department}
              </MenuItem>
            )
          )}
        </TextField>

        <TextField
          fullWidth
          required
          label="Job Title"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          required
          select
          label="Employment Status"
          name="employmentStatus"
          value={formData.employmentStatus}
          onChange={handleChange}
        >
          <MenuItem value="ACTIVE">Active</MenuItem>
          <MenuItem value="INACTIVE">Inactive</MenuItem>
        </TextField>

        <TextField
          fullWidth
          required
          type="date"
          label="Hire Date"
          name="hireDate"
          value={formData.hireDate}
          onChange={handleChange}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />

        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>

          <Button type="submit" variant="contained">
            Save Employee
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
