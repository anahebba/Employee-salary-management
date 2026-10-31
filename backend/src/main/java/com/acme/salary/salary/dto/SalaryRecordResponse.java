package com.acme.salary.salary.dto;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record SalaryRecordResponse(
        Long id,
        Long employeeId,
        BigDecimal annualSalary,
        String currencyCode,
        LocalDate effectiveFrom,
        LocalDate effectiveTo,
        LocalDateTime createdAt
) {}