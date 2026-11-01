package com.acme.salary.salary.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record SalaryDirectoryResponse(
        Long employeeId,
        String employeeCode,
        String firstName,
        String lastName,
        String country,
        String department,
        String jobTitle,
        BigDecimal annualSalary,
        String currencyCode,
        LocalDate effectiveFrom
) {
}