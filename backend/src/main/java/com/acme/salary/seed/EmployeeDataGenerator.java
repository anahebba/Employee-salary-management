package com.acme.salary.seed;

import net.datafaker.Faker;

import java.util.List;
import java.util.Locale;
import java.util.Random;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import com.acme.salary.employee.repository.EmployeeRepository;
import org.springframework.stereotype.Component;
import com.acme.salary.employee.entity.Employee;
import com.acme.salary.employee.entity.EmploymentStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import java.math.BigDecimal;
import java.time.LocalDate;
import com.acme.salary.salary.entity.SalaryRecord;
import java.util.Map;
import org.springframework.transaction.annotation.Transactional;

@Component
public class EmployeeDataGenerator {
    private final JdbcTemplate jdbcTemplate;
    private final EmployeeRepository employeeRepository;
    private static final int TARGET_EMPLOYEE_COUNT = 10_000;

    public EmployeeDataGenerator(
            EmployeeRepository employeeRepository,
            JdbcTemplate jdbcTemplate
    ) {
        this.employeeRepository = employeeRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    private int getRemainingEmployeeCount() {
        long existingCount = employeeRepository.count();

        return (int) Math.max(0, TARGET_EMPLOYEE_COUNT - existingCount);
    }

    private final Faker faker = new Faker(new Locale("en"));
    private final Random random = new Random();

    private static final List<String> COUNTRIES = List.of(
            "India", "USA", "UK", "Germany"
    );

    private static final List<String> DEPARTMENTS = List.of(
            "Engineering", "Finance", "Human Resources", "Marketing"
    );
    private String getRandomCountry() {
        return COUNTRIES.get(random.nextInt(COUNTRIES.size()));
    }

    private String getRandomDepartment() {
        return DEPARTMENTS.get(random.nextInt(DEPARTMENTS.size()));
    }

    private String getRandomEmploymentStatus() {
        return random.nextInt(10) == 0 ? "INACTIVE" : "ACTIVE";
    }

    private String getRandomJobTitle(String department) {

        return switch (department) {
            case "Engineering" -> List.of(
                    "Software Engineer",
                    "Senior Software Engineer",
                    "Tech Lead",
                    "Engineering Manager",
                    "QA Engineer"
            ).get(random.nextInt(5));

            case "Finance" -> List.of(
                    "Financial Analyst",
                    "Accountant",
                    "Finance Manager",
                    "Senior Accountant"
            ).get(random.nextInt(4));

            case "Human Resources" -> List.of(
                    "HR Executive",
                    "HR Manager",
                    "Recruiter",
                    "Talent Acquisition Specialist"
            ).get(random.nextInt(4));

            case "Marketing" -> List.of(
                    "Marketing Specialist",
                    "Marketing Manager",
                    "Content Strategist",
                    "Digital Marketing Executive"
            ).get(random.nextInt(4));

            default -> "Associate";
        };
    }
    private String getCurrencyCode(String country) {
        return switch (country) {
            case "India" -> "INR";
            case "USA" -> "USD";
            case "UK" -> "GBP";
            case "Germany" -> "EUR";
            default -> "USD";
        };
    }
    private BigDecimal getRandomSalary(String country) {
        return switch (country) {
            case "India" -> BigDecimal.valueOf(600_000L + random.nextInt(1_400_001));
            case "USA" -> BigDecimal.valueOf(45_000L + random.nextInt(105_001));
            case "UK" -> BigDecimal.valueOf(30_000L + random.nextInt(70_001));
            case "Germany" -> BigDecimal.valueOf(35_000L + random.nextInt(75_001));
            default -> BigDecimal.valueOf(40_000L + random.nextInt(60_001));
        };
    }

    private LocalDate getRandomHireDate() {
        LocalDate startDate = LocalDate.of(2018, 1, 1);
        LocalDate endDate = LocalDate.now();

        long daysBetween = ChronoUnit.DAYS.between(startDate, endDate);

        return startDate.plusDays(random.nextLong(daysBetween + 1));
    }

    private Employee createEmployee(int employeeNumber) {

        String country = getRandomCountry();
        String department = getRandomDepartment();

        Employee employee = new Employee();

        employee.setEmployeeCode(
                "ACME" + String.format("%03d", employeeNumber)
        );

        employee.setFirstName(faker.name().firstName());
        employee.setLastName(faker.name().lastName());

        employee.setEmail(
                "employee" + employeeNumber + "@acme.com"
        );

        employee.setCountry(country);
        employee.setDepartment(department);
        employee.setJobTitle(getRandomJobTitle(department));

        employee.setEmploymentStatus(
                EmploymentStatus.valueOf(getRandomEmploymentStatus())
        );

        employee.setHireDate(getRandomHireDate());

        return employee;
    }

    private List<Employee> generateEmployees(int count, int startingNumber) {

        List<Employee> employees = new java.util.ArrayList<>();

        for (int i = 0; i < count; i++) {
            int employeeNumber = startingNumber + i;
            employees.add(createEmployee(employeeNumber));
        }

        return employees;
    }



    //batch insert to psql
    private void saveEmployeesInBatch(List<Employee> employees) {

        String sql = """
            INSERT INTO employees (
                employee_code,
                first_name,
                last_name,
                email,
                country,
                department,
                job_title,
                employment_status,
                hire_date
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;

        jdbcTemplate.batchUpdate(
                sql,
                employees,
                500,
                (ps, employee) -> {
                    ps.setString(1, employee.getEmployeeCode());
                    ps.setString(2, employee.getFirstName());
                    ps.setString(3, employee.getLastName());
                    ps.setString(4, employee.getEmail());
                    ps.setString(5, employee.getCountry());
                    ps.setString(6, employee.getDepartment());
                    ps.setString(7, employee.getJobTitle());
                    ps.setString(8, employee.getEmploymentStatus().name());
                    ps.setObject(9, employee.getHireDate());
                }
        );
    }

    private SalaryRecord createSalaryRecord(Employee employee) {

        SalaryRecord salaryRecord = new SalaryRecord();

        salaryRecord.setEmployee(employee);




        salaryRecord.setAnnualSalary(
                getRandomSalary(employee.getCountry())
        );
        salaryRecord.setCurrencyCode(
                getCurrencyCode(employee.getCountry())
        );
        salaryRecord.setEffectiveFrom(employee.getHireDate());

        salaryRecord.setEffectiveTo(null);

        return salaryRecord;
    }
    private void saveSalaryRecordsInBatch(List<SalaryRecord> salaryRecords) {

        String sql = """
            INSERT INTO salary_records (
                employee_id,
                annual_salary,
                currency_code,
                effective_from,
                effective_to
            )
            VALUES (?, ?, ?, ?, ?)
            """;

        jdbcTemplate.batchUpdate(
                sql,
                salaryRecords,
                500,
                (ps, salaryRecord) -> {
                    ps.setLong(1, salaryRecord.getEmployee().getId());
                    ps.setBigDecimal(2, salaryRecord.getAnnualSalary());
                    ps.setString(3, salaryRecord.getCurrencyCode());
                    ps.setObject(4, salaryRecord.getEffectiveFrom());
                    ps.setObject(5, salaryRecord.getEffectiveTo());
                }
        );
    }

    private List<Employee> findEmployeesByCodes(List<Employee> employees) {

        List<String> employeeCodes = employees.stream()
                .map(Employee::getEmployeeCode)
                .toList();

        String placeholders = String.join(
                ",",
                java.util.Collections.nCopies(employeeCodes.size(), "?")
        );

        String sql = """
            SELECT id, employee_code
            FROM employees
            WHERE employee_code IN (%s)
            """.formatted(placeholders);

        Map<String, Long> employeeIds = jdbcTemplate.query(
                sql,
                rs -> {
                    Map<String, Long> result = new java.util.HashMap<>();

                    while (rs.next()) {
                        result.put(
                                rs.getString("employee_code"),
                                rs.getLong("id")
                        );
                    }

                    return result;
                },
                employeeCodes.toArray()
        );

        for (Employee employee : employees) {
            Long id = employeeIds.get(employee.getEmployeeCode());

            if (id == null) {
                throw new IllegalStateException(
                        "Could not find employee: " + employee.getEmployeeCode()
                );
            }

            // We'll use these IDs to link salary records.
            employee.setId(id);
        }

        return employees;
    }

    private List<SalaryRecord> generateSalaryRecords(List<Employee> employees) {

        List<SalaryRecord> salaryRecords = new java.util.ArrayList<>();

        for (Employee employee : employees) {
            salaryRecords.add(createSalaryRecord(employee));
        }

        return salaryRecords;
    }
    private void validateEmployeeCount() {
        long existingCount = employeeRepository.count();

        if (existingCount >= TARGET_EMPLOYEE_COUNT) {
            throw new IllegalStateException(
                    "Employee count is already " + existingCount
                            + ". Target is " + TARGET_EMPLOYEE_COUNT
            );
        }
    }

    private int getNextEmployeeNumber() {

        Integer maxNumber = jdbcTemplate.queryForObject(
                """
                SELECT COALESCE(
                    MAX(CAST(SUBSTRING(employee_code FROM 5) AS INTEGER)),
                    0
                )
                FROM employees
                WHERE employee_code ~ '^ACME[0-9]+$'
                """,
                Integer.class
        );

        return maxNumber + 1;
    }



    @Transactional
    public void generateData() {

        validateEmployeeCount();

        int remainingCount = getRemainingEmployeeCount();
        int startingNumber = getNextEmployeeNumber();

        System.out.println("Generating " + remainingCount + " employees...");

        List<Employee> employees = generateEmployees(
                remainingCount,
                startingNumber
        );

        saveEmployeesInBatch(employees);

        List<Employee> savedEmployees = findEmployeesByCodes(employees);

        List<SalaryRecord> salaryRecords =
                generateSalaryRecords(savedEmployees);

        saveSalaryRecordsInBatch(salaryRecords);

        System.out.println("Employee generation completed!");
        System.out.println("Employees created: " + employees.size());
        System.out.println("Salary records created: " + salaryRecords.size());
    }
}