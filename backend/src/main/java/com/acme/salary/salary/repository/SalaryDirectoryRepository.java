package com.acme.salary.salary.repository;

import com.acme.salary.salary.dto.SalaryDirectoryResponse;
import com.acme.salary.salary.entity.SalaryRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface SalaryDirectoryRepository
        extends JpaRepository<SalaryRecord, Long> {

    @Query(
            value = """
            SELECT new com.acme.salary.salary.dto.SalaryDirectoryResponse(
                e.id,
                e.employeeCode,
                e.firstName,
                e.lastName,
                e.country,
                e.department,
                e.jobTitle,
                s.annualSalary,
                s.currencyCode,
                s.effectiveFrom
            )
            FROM SalaryRecord s
            JOIN s.employee e
            WHERE e.employmentStatus = 'ACTIVE'
              AND s.effectiveFrom <= :reportDate
              AND (s.effectiveTo IS NULL OR s.effectiveTo >= :reportDate)
            ORDER BY e.firstName ASC, e.lastName ASC
            """,
            countQuery = """
            SELECT COUNT(s.id)
            FROM SalaryRecord s
            JOIN s.employee e
            WHERE e.employmentStatus = 'ACTIVE'
              AND s.effectiveFrom <= :reportDate
              AND (s.effectiveTo IS NULL OR s.effectiveTo >= :reportDate)
            """
    )
    Page<SalaryDirectoryResponse> findCurrentSalaries(
            @Param("reportDate") LocalDate reportDate,
            Pageable pageable
    );
}