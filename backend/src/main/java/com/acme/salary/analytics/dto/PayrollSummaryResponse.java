package com.acme.salary.analytics.dto;

import java.math.BigDecimal;

public record PayrollSummaryResponse(
        String country,
        String currencyCode,
        Long employeeCount,
        BigDecimal totalAnnualPayroll
) {
}