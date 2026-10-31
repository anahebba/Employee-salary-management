package com.acme.salary.analytics.dto;

public record HeadcountSummaryResponse(
        String country,
        String department,
        Long employeeCount
) {
}