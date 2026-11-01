package com.acme.salary.salary.dto;

public record SalaryDirectorySummaryResponse(
        Long employeesWithCurrentSalary,
        Long employeesWithoutCurrentSalary,
        Long countriesCovered,
        Long recentSalaryRevisions
) {
}