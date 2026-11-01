
package com.acme.salary.salary.service;

import com.acme.salary.salary.dto.SalaryDirectoryResponse;
import com.acme.salary.salary.dto.SalaryDirectorySummaryResponse;
import com.acme.salary.salary.repository.SalaryDirectoryRepository;
import com.acme.salary.salary.repository.SalaryDirectoryAnalyticsRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.acme.salary.salary.dto.EmployeesWithoutSalaryResponse;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class SalaryDirectoryService {

    private final SalaryDirectoryRepository salaryDirectoryRepository;
    private final SalaryDirectoryAnalyticsRepository analyticsRepository;

    public SalaryDirectoryService(
            SalaryDirectoryRepository salaryDirectoryRepository,
            SalaryDirectoryAnalyticsRepository analyticsRepository) {
        this.salaryDirectoryRepository = salaryDirectoryRepository;
        this.analyticsRepository = analyticsRepository;
    }

    @Transactional(readOnly = true)
    public Page<SalaryDirectoryResponse> getCurrentSalaries(
            String country, String department, String currencyCode, String search,
            Pageable pageable) {

        return salaryDirectoryRepository.findCurrentSalaries(
                LocalDate.now(), country, department, currencyCode,
                (search == null || search.isBlank()) ? null : search.trim(), pageable
        );
    }

    @Transactional(readOnly = true)
    public SalaryDirectorySummaryResponse getSummary() {

        LocalDate today = LocalDate.now();
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);

        return new SalaryDirectorySummaryResponse(
                analyticsRepository.countEmployeesWithCurrentSalary(today),
                analyticsRepository.countEmployeesWithoutCurrentSalary(today),
                analyticsRepository.countCountriesCovered(today),
                analyticsRepository.countRecentSalaryRevisions(thirtyDaysAgo)
        );
    }

    @Transactional(readOnly = true)
    public java.util.List<EmployeesWithoutSalaryResponse>
    getActiveEmployeesWithoutCurrentSalary() {

        return analyticsRepository.findActiveEmployeesWithoutCurrentSalary(
                LocalDate.now()
        );
    }

}
