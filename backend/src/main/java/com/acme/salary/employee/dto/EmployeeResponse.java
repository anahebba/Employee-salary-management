package com.acme.salary.employee.dto;

import com.acme.salary.employee.entity.EmploymentStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record EmployeeResponse(
        Long id,
        String employeeCode,
        String firstName,
        String lastName,
        String email,
        String country,
        String department,
        String jobTitle,
        EmploymentStatus employmentStatus,
        LocalDate hireDate,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}