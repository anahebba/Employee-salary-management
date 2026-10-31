INSERT INTO salary_records (
    employee_id,
    annual_salary,
    currency_code,
    effective_from
)
SELECT
    e.id,
    CASE
        WHEN e.country = 'India' THEN 1200000.00
        WHEN e.country = 'USA' THEN 90000.00
        WHEN e.country = 'UK' THEN 65000.00
        WHEN e.country = 'Germany' THEN 70000.00
        ELSE 50000.00
        END,
    CASE
        WHEN e.country = 'India' THEN 'INR'
        WHEN e.country = 'USA' THEN 'USD'
        WHEN e.country = 'UK' THEN 'GBP'
        WHEN e.country = 'Germany' THEN 'EUR'
        ELSE 'USD'
        END,
    DATE '2026-01-01'
FROM employees e
WHERE NOT EXISTS (
    SELECT 1
    FROM salary_records s
    WHERE s.employee_id = e.id
);