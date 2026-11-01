package com.acme.salary.salary.repository;

import com.acme.salary.employee.entity.Employee;
import com.acme.salary.salary.entity.SalaryRecord;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import com.acme.salary.salary.dto.EmployeesWithoutSalaryResponse;
import java.util.List;

import java.time.LocalDate;
import java.time.LocalDateTime;

public interface SalaryDirectoryAnalyticsRepository
        extends Repository<SalaryRecord, Long> {

    @Query("""
        SELECT COUNT(DISTINCT e.id)
        FROM Employee e
        WHERE e.employmentStatus = 'ACTIVE'
          AND EXISTS (
              SELECT s.id
              FROM SalaryRecord s
              WHERE s.employee = e
                AND s.effectiveFrom <= :reportDate
                AND (s.effectiveTo IS NULL OR s.effectiveTo >= :reportDate)
          )
        """)
    Long countEmployeesWithCurrentSalary(
            @Param("reportDate") LocalDate reportDate
    );

    @Query("""
        SELECT COUNT(e.id)
        FROM Employee e
        WHERE e.employmentStatus = 'ACTIVE'
          AND NOT EXISTS (
              SELECT s.id
              FROM SalaryRecord s
              WHERE s.employee = e
                AND s.effectiveFrom <= :reportDate
                AND (s.effectiveTo IS NULL OR s.effectiveTo >= :reportDate)
          )
        """)
    Long countEmployeesWithoutCurrentSalary(
            @Param("reportDate") LocalDate reportDate
    );

    @Query("""
        SELECT COUNT(DISTINCT e.country)
        FROM Employee e
        WHERE e.employmentStatus = 'ACTIVE'
          AND EXISTS (
              SELECT s.id
              FROM SalaryRecord s
              WHERE s.employee = e
                AND s.effectiveFrom <= :reportDate
                AND (s.effectiveTo IS NULL OR s.effectiveTo >= :reportDate)
          )
        """)
    Long countCountriesCovered(
            @Param("reportDate") LocalDate reportDate
    );

    @Query("""
    SELECT COUNT(s.id)
    FROM SalaryRecord s
    WHERE s.createdAt >= :since
      AND EXISTS (
          SELECT previous.id
          FROM SalaryRecord previous
          WHERE previous.employee = s.employee
            AND previous.effectiveFrom < s.effectiveFrom
      )
    """)
    Long countRecentSalaryRevisions(
            @Param("since") LocalDateTime since
    );

    @Query("""
    SELECT new com.acme.salary.salary.dto.EmployeesWithoutSalaryResponse(
        e.id,
        e.employeeCode,
        e.firstName,
        e.lastName,
        e.country,
        e.department,
        e.jobTitle,
        CASE WHEN (
            SELECT COUNT(future.id)
            FROM SalaryRecord future
            WHERE future.employee = e
              AND future.effectiveFrom > :reportDate
        ) > 0 THEN true ELSE false END,
        (
            SELECT MIN(future.effectiveFrom)
            FROM SalaryRecord future
            WHERE future.employee = e
              AND future.effectiveFrom > :reportDate
        )
    )
    FROM Employee e
    WHERE e.employmentStatus = 'ACTIVE'
      AND NOT EXISTS (
          SELECT s.id
          FROM SalaryRecord s
          WHERE s.employee = e
            AND s.effectiveFrom <= :reportDate
            AND (s.effectiveTo IS NULL OR s.effectiveTo >= :reportDate)
      )
    ORDER BY e.firstName ASC, e.lastName ASC
    """)
    List<EmployeesWithoutSalaryResponse> findActiveEmployeesWithoutCurrentSalary(
            @Param("reportDate") LocalDate reportDate
    );
}