package com.acme.salary.analytics.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.sql.Date;
import java.time.LocalDate;
import java.util.*;

@Service
public class AdvancedAnalyticsService {
    private final JdbcTemplate jdbc;
    public AdvancedAnalyticsService(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    private String filterSql() {
        return " AND (:country IS NULL OR e.country = :country) AND (:department IS NULL OR e.department = :department) ";
    }

    public Map<String,Object> dashboard(LocalDate from, LocalDate to, String country, String department) {
        LocalDate asOf = to == null ? LocalDate.now() : to;
        LocalDate start = from == null ? asOf.minusMonths(11).withDayOfMonth(1) : from;
        Map<String,Object> result = new LinkedHashMap<>();
        String filters = filterSql();
        result.put("filters", Map.of("from", start, "to", asOf, "country", country == null ? "ALL" : country, "department", department == null ? "ALL" : department));
        result.put("payrollByCountry", jdbc.queryForList("""
            SELECT e.country, s.currency_code AS "currencyCode", COUNT(*) AS "employeeCount", SUM(s.annual_salary) AS "totalAnnualPayroll"
            FROM salary_records s JOIN employees e ON e.id=s.employee_id
            WHERE e.employment_status='ACTIVE' AND s.effective_from<=? AND (s.effective_to IS NULL OR s.effective_to>=?)
              AND (CAST(? AS VARCHAR) IS NULL OR e.country=?) AND (CAST(? AS VARCHAR) IS NULL OR e.department=?)
            GROUP BY e.country,s.currency_code ORDER BY e.country,s.currency_code
            """, asOf, asOf, country, country, department, department));
        result.put("headcountByDepartment", jdbc.queryForList("""
            SELECT e.department, e.country, COUNT(*) AS "employeeCount" FROM employees e
            WHERE e.employment_status='ACTIVE' AND (CAST(? AS VARCHAR) IS NULL OR e.country=?) AND (CAST(? AS VARCHAR) IS NULL OR e.department=?)
            GROUP BY e.department,e.country ORDER BY e.department,e.country
            """, country, country, department, department));
        result.put("salaryBands", jdbc.queryForList("""
            SELECT e.country,e.department,e.job_title AS "jobTitle",s.currency_code AS "currencyCode",
              COUNT(*) AS "employeeCount", percentile_cont(0.25) within group(order by s.annual_salary) AS "p25",
              percentile_cont(0.50) within group(order by s.annual_salary) AS "median",
              percentile_cont(0.75) within group(order by s.annual_salary) AS "p75"
            FROM salary_records s JOIN employees e ON e.id=s.employee_id
            WHERE e.employment_status='ACTIVE' AND s.effective_from<=? AND (s.effective_to IS NULL OR s.effective_to>=?)
              AND (CAST(? AS VARCHAR) IS NULL OR e.country=?) AND (CAST(? AS VARCHAR) IS NULL OR e.department=?)
            GROUP BY e.country,e.department,e.job_title,s.currency_code ORDER BY e.country,e.department,e.job_title
            """, asOf, asOf, country, country, department, department));
        result.put("salaryOutliers", jdbc.queryForList("""
            WITH peer_bands AS (
              SELECT e.country,e.department,e.job_title,s.currency_code,
                percentile_cont(0.10) within group(order by s.annual_salary) AS p10,
                percentile_cont(0.90) within group(order by s.annual_salary) AS p90
              FROM salary_records s JOIN employees e ON e.id=s.employee_id
              WHERE e.employment_status='ACTIVE' AND s.effective_from<=? AND (s.effective_to IS NULL OR s.effective_to>=?)
                AND (CAST(? AS VARCHAR) IS NULL OR e.country=?) AND (CAST(? AS VARCHAR) IS NULL OR e.department=?)
              GROUP BY e.country,e.department,e.job_title,s.currency_code
            )
            SELECT e.employee_code AS "employeeCode",e.first_name AS "firstName",e.last_name AS "lastName",
              e.country,e.department,e.job_title AS "jobTitle",s.annual_salary AS "annualSalary",
              s.currency_code AS "currencyCode",b.p10,b.p90
            FROM salary_records s JOIN employees e ON e.id=s.employee_id
            JOIN peer_bands b ON b.country=e.country AND b.department=e.department AND b.job_title=e.job_title AND b.currency_code=s.currency_code
            WHERE e.employment_status='ACTIVE' AND s.effective_from<=? AND (s.effective_to IS NULL OR s.effective_to>=?)
              AND (CAST(? AS VARCHAR) IS NULL OR e.country=?) AND (CAST(? AS VARCHAR) IS NULL OR e.department=?)
              AND (s.annual_salary < b.p10 OR s.annual_salary > b.p90)
            ORDER BY e.country,e.department,e.job_title LIMIT 250
            """, asOf, asOf, country, country, department, department, asOf, asOf, country, country, department, department));
        result.put("salaryTrend", jdbc.queryForList("""
            SELECT to_char(date_trunc('month',s.effective_from),'YYYY-MM') AS month,
              COUNT(*) AS "revisionCount", AVG(s.annual_salary) AS "averageSalary"
            FROM salary_records s JOIN employees e ON e.id=s.employee_id
            WHERE s.revision_reason <> 'INITIAL' AND s.effective_from BETWEEN ? AND ? AND (CAST(? AS VARCHAR) IS NULL OR e.country=?) AND (CAST(? AS VARCHAR) IS NULL OR e.department=?)
            GROUP BY date_trunc('month',s.effective_from) ORDER BY date_trunc('month',s.effective_from)
            """, start, asOf, country, country, department, department));
        result.put("summary", jdbc.queryForMap("""
            SELECT COUNT(DISTINCT e.id) AS "activeEmployees",COUNT(DISTINCT e.country) AS "countriesCovered",
              COUNT(DISTINCT (e.country,s.currency_code)) AS "payrollGroups"
            FROM employees e LEFT JOIN salary_records s ON s.employee_id=e.id AND s.effective_from<=? AND (s.effective_to IS NULL OR s.effective_to>=?)
            WHERE e.employment_status='ACTIVE' AND (CAST(? AS VARCHAR) IS NULL OR e.country=?) AND (CAST(? AS VARCHAR) IS NULL OR e.department=?)
            """, asOf, asOf, country, country, department, department));
        return result;
    }
}
