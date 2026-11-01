package com.acme.salary.report;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.*;

@Service
public class ReportService {
    private final JdbcTemplate jdbc;
    public ReportService(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    private static final Map<String, String> QUERIES = Map.of(
        "employee_directory", """
            SELECT employee_code AS "Employee ID", first_name AS "First name", last_name AS "Last name",
              email AS "Email", country AS "Country", department AS "Department", job_title AS "Job title",
              employment_status AS "Status", hire_date AS "Hire date"
            FROM employees
            WHERE (CAST(? AS VARCHAR) IS NULL OR country=?)
              AND (CAST(? AS VARCHAR) IS NULL OR department=?)
              AND (CAST(? AS VARCHAR) IS NULL OR employment_status=?)
              AND (CAST(? AS VARCHAR) IS NULL OR LOWER(first_name||' '||last_name||' '||employee_code) LIKE LOWER('%'||?||'%'))
            ORDER BY last_name,first_name LIMIT 5000
            """,
        "current_salary", """
            SELECT e.employee_code AS "Employee ID",e.first_name AS "First name",e.last_name AS "Last name",
              e.country AS "Country",e.department AS "Department",e.job_title AS "Job title",
              s.annual_salary AS "Annual salary",s.currency_code AS "Currency",s.effective_from AS "Effective from"
            FROM salary_records s JOIN employees e ON e.id=s.employee_id
            WHERE e.employment_status='ACTIVE' AND s.effective_from<=? AND (s.effective_to IS NULL OR s.effective_to>=?)
              AND (CAST(? AS VARCHAR) IS NULL OR e.country=?) AND (CAST(? AS VARCHAR) IS NULL OR e.department=?)
            ORDER BY e.country,e.department,e.last_name LIMIT 5000
            """,
        "salary_revisions", """
            SELECT e.employee_code AS "Employee ID",e.first_name AS "First name",e.last_name AS "Last name",
              e.country AS "Country",e.department AS "Department",s.annual_salary AS "Annual salary",
              s.currency_code AS "Currency",s.effective_from AS "Effective from",s.revision_reason AS "Reason",
              s.revision_notes AS "Notes"
            FROM salary_records s JOIN employees e ON e.id=s.employee_id
            WHERE s.revision_reason <> 'INITIAL' AND s.effective_from BETWEEN ? AND ? AND (CAST(? AS VARCHAR) IS NULL OR e.country=?)
              AND (CAST(? AS VARCHAR) IS NULL OR e.department=?)
            ORDER BY s.effective_from DESC LIMIT 5000
            """,
        "upcoming_salary_changes", """
            SELECT e.employee_code AS "Employee ID",e.first_name AS "First name",e.last_name AS "Last name",
              e.country AS "Country",e.department AS "Department",s.annual_salary AS "New salary",
              s.currency_code AS "Currency",s.effective_from AS "Effective from",s.revision_reason AS "Reason"
            FROM salary_records s JOIN employees e ON e.id=s.employee_id
            WHERE s.effective_from>? AND e.employment_status='ACTIVE'
              AND (CAST(? AS VARCHAR) IS NULL OR e.country=?) AND (CAST(? AS VARCHAR) IS NULL OR e.department=?)
            ORDER BY s.effective_from LIMIT 5000
            """,
        "employees_without_salary", """
            SELECT e.employee_code AS "Employee ID",e.first_name AS "First name",e.last_name AS "Last name",
              e.country AS "Country",e.department AS "Department",e.job_title AS "Job title"
            FROM employees e WHERE e.employment_status='ACTIVE'
              AND (CAST(? AS VARCHAR) IS NULL OR e.country=?) AND (CAST(? AS VARCHAR) IS NULL OR e.department=?)
              AND NOT EXISTS(SELECT 1 FROM salary_records s WHERE s.employee_id=e.id AND s.effective_from<=?
                AND (s.effective_to IS NULL OR s.effective_to>=?))
            ORDER BY e.country,e.last_name LIMIT 5000
            """,
        "country_payroll", """
            SELECT e.country AS "Country",s.currency_code AS "Currency",COUNT(*) AS "Employees",
              SUM(s.annual_salary) AS "Annual payroll"
            FROM salary_records s JOIN employees e ON e.id=s.employee_id
            WHERE e.employment_status='ACTIVE' AND s.effective_from<=? AND (s.effective_to IS NULL OR s.effective_to>=?)
              AND (CAST(? AS VARCHAR) IS NULL OR e.country=?) AND (CAST(? AS VARCHAR) IS NULL OR e.department=?)
            GROUP BY e.country,s.currency_code ORDER BY e.country,s.currency_code
            """,
        "salary_outliers", """
            WITH peer AS (
              SELECT e.country,e.department,e.job_title,s.currency_code,
                percentile_cont(0.10) within group(order by s.annual_salary) AS p10,
                percentile_cont(0.90) within group(order by s.annual_salary) AS p90
              FROM salary_records s JOIN employees e ON e.id=s.employee_id
              WHERE e.employment_status='ACTIVE' AND s.effective_from<=? AND (s.effective_to IS NULL OR s.effective_to>=?)
                AND (CAST(? AS VARCHAR) IS NULL OR e.country=?) AND (CAST(? AS VARCHAR) IS NULL OR e.department=?)
              GROUP BY e.country,e.department,e.job_title,s.currency_code
            )
            SELECT e.employee_code AS "Employee ID",e.first_name AS "First name",e.last_name AS "Last name",
              e.country AS "Country",e.department AS "Department",e.job_title AS "Job title",
              s.annual_salary AS "Annual salary",s.currency_code AS "Currency",p.p10 AS "P10",p.p90 AS "P90"
            FROM salary_records s JOIN employees e ON e.id=s.employee_id
            JOIN peer p ON p.country=e.country AND p.department=e.department AND p.job_title=e.job_title AND p.currency_code=s.currency_code
            WHERE e.employment_status='ACTIVE' AND s.effective_from<=? AND (s.effective_to IS NULL OR s.effective_to>=?)
              AND (CAST(? AS VARCHAR) IS NULL OR e.country=?) AND (CAST(? AS VARCHAR) IS NULL OR e.department=?)
              AND (s.annual_salary<p.p10 OR s.annual_salary>p.p90)
            ORDER BY e.country,e.department,e.job_title LIMIT 5000
            """
    );

    public List<Map<String, Object>> run(String type, String country, String department,
                                         String status, String search, LocalDate from, LocalDate to) {
        String sql = QUERIES.get(type);
        if (sql == null) throw new IllegalArgumentException("Unsupported report type");
        LocalDate start = from == null ? LocalDate.now().minusYears(1) : from;
        LocalDate end = to == null ? LocalDate.now() : to;
        return switch (type) {
            case "employee_directory" -> jdbc.queryForList(sql, country, country, department, department, status, status, search, search);
            case "current_salary" -> jdbc.queryForList(sql, end, end, country, country, department, department);
            case "salary_revisions" -> jdbc.queryForList(sql, start, end, country, country, department, department);
            case "upcoming_salary_changes" -> jdbc.queryForList(sql, LocalDate.now(), country, country, department, department);
            case "employees_without_salary" -> jdbc.queryForList(sql, country, country, department, department, end, end);
            case "country_payroll" -> jdbc.queryForList(sql, end, end, country, country, department, department);
            case "salary_outliers" -> jdbc.queryForList(sql, end, end, country, country, department, department, end, end, country, country, department, department);
            default -> List.of();
        };
    }

    public List<Map<String, Object>> saved() {
        return jdbc.queryForList("SELECT id,name,report_type AS \"reportType\",configuration::text AS configuration,created_at AS \"createdAt\" FROM saved_reports ORDER BY updated_at DESC");
    }

    @Transactional
    public Map<String, Object> save(String name, String type, String config) {
        if (name == null || name.isBlank()) throw new IllegalArgumentException("Report name is required");
        if (!QUERIES.containsKey(type)) throw new IllegalArgumentException("Unsupported report type");
        return jdbc.queryForMap("INSERT INTO saved_reports(name,report_type,configuration) VALUES(?,?,?::jsonb) RETURNING id,name,report_type AS \"reportType\",configuration::text AS configuration,created_at AS \"createdAt\"",
                name.trim(), type, config == null ? "{}" : config);
    }

    @Transactional public void delete(Long id) { jdbc.update("DELETE FROM saved_reports WHERE id=?", id); }
}
