package com.acme.salary.analytics.dto;

import java.math.BigDecimal;

public record SalaryStatisticsResponse(
        String country,
        String currencyCode,
        Double averageSalary,
        BigDecimal minimumSalary,
        BigDecimal maximumSalary,
        Double medianSalary
) {
}