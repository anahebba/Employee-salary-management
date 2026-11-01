package com.acme.salary.salary.controller;

import com.acme.salary.salary.dto.SalaryDirectoryResponse;
import com.acme.salary.salary.service.SalaryDirectoryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import com.acme.salary.salary.dto.SalaryDirectorySummaryResponse;
import com.acme.salary.salary.dto.EmployeesWithoutSalaryResponse;
import java.util.List;
@RestController
@RequestMapping("/api/salaries")
@CrossOrigin(origins = "http://localhost:5173")
public class SalaryDirectoryController {

    private final SalaryDirectoryService salaryDirectoryService;

    public SalaryDirectoryController(
            SalaryDirectoryService salaryDirectoryService) {
        this.salaryDirectoryService = salaryDirectoryService;
    }

    @GetMapping
    public Page<SalaryDirectoryResponse> getSalaryDirectory(
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String currencyCode,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 10) Pageable pageable) {

        return salaryDirectoryService.getCurrentSalaries(
                country, department, currencyCode, search, pageable);
    }

    @GetMapping("/summary")
    public SalaryDirectorySummaryResponse getSalaryDirectorySummary() {
        return salaryDirectoryService.getSummary();
    }
    @GetMapping("/employees-without-current-salary")
    public List<EmployeesWithoutSalaryResponse>
    getEmployeesWithoutCurrentSalary() {

        return salaryDirectoryService.getActiveEmployeesWithoutCurrentSalary();
    }
}