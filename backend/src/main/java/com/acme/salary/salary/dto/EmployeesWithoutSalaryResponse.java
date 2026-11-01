package com.acme.salary.salary.dto;

import java.time.LocalDate;

public record EmployeesWithoutSalaryResponse(
        Long employeeId,
        String employeeCode,
        String firstName,
        String lastName,
        String country,
        String department,
        String jobTitle,
        boolean hasFutureSalary,
        LocalDate futureSalaryEffectiveFrom
) {}