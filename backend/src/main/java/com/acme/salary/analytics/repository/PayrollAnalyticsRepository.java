package com.acme.salary.analytics.repository;

import com.acme.salary.analytics.dto.PayrollSummaryResponse;
import com.acme.salary.salary.entity.SalaryRecord;
import com.acme.salary.employee.entity.EmploymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.acme.salary.analytics.dto.HeadcountSummaryResponse;
import com.acme.salary.employee.entity.Employee;
import com.acme.salary.analytics.dto.SalaryStatisticsResponse;
import com.acme.salary.analytics.repository.SalaryStatisticsProjection;

import java.time.LocalDate;
import java.util.List;

public interface PayrollAnalyticsRepository
        extends JpaRepository<SalaryRecord, Long> {
//total payroll by country n currency
    @Query("""
            SELECT new com.acme.salary.analytics.dto.PayrollSummaryResponse(
                e.country,
                s.currencyCode,
                COUNT(DISTINCT e.id),
                SUM(s.annualSalary)
            )
            FROM SalaryRecord s
            JOIN s.employee e
            WHERE e.employmentStatus = :status
              AND s.effectiveFrom <= :reportDate
              AND (s.effectiveTo IS NULL OR s.effectiveTo >= :reportDate)
            GROUP BY e.country, s.currencyCode
            ORDER BY e.country, s.currencyCode
            """)
    List<PayrollSummaryResponse> findPayrollSummary(
            @Param("status") EmploymentStatus status,
            @Param("reportDate") LocalDate reportDate
    );

//headcount by country n departmnet
    @Query("""
        SELECT new com.acme.salary.analytics.dto.HeadcountSummaryResponse(
            e.country,
            e.department,
            COUNT(e.id)
        )
        FROM Employee e
        WHERE e.employmentStatus = :status
        GROUP BY e.country, e.department
        ORDER BY e.country, e.department
        """)
    List<HeadcountSummaryResponse> findHeadcountSummary(
            @Param("status") EmploymentStatus status
    );




    //median,min,max,vg
    @Query(value = """
        SELECT
            e.country AS country,
            s.currency_code AS "currencyCode",
            AVG(s.annual_salary) AS "averageSalary",
            MIN(s.annual_salary) AS "minimumSalary",
            MAX(s.annual_salary) AS "maximumSalary",
            PERCENTILE_CONT(0.5)
                WITHIN GROUP (ORDER BY s.annual_salary) AS "medianSalary"
        FROM salary_records s
        JOIN employees e ON e.id = s.employee_id
        WHERE e.employment_status = :status
          AND s.effective_from <= :reportDate
          AND (s.effective_to IS NULL OR s.effective_to >= :reportDate)
        GROUP BY e.country, s.currency_code
        ORDER BY e.country, s.currency_code
        """, nativeQuery = true)
    List<SalaryStatisticsProjection> findSalaryStatisticsWithMedian(
            @Param("status") String status,
            @Param("reportDate") LocalDate reportDate
    );

}