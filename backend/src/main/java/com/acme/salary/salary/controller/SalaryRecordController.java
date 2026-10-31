
package com.acme.salary.salary.controller;

import com.acme.salary.salary.dto.CreateSalaryRecordRequest;
import com.acme.salary.salary.dto.SalaryRecordResponse;
import com.acme.salary.salary.service.SalaryRecordService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees/{employeeId}/salary-records")
@CrossOrigin(origins = "http://localhost:5173")
public class SalaryRecordController {

    private final SalaryRecordService salaryRecordService;

    public SalaryRecordController(
            SalaryRecordService salaryRecordService) {
        this.salaryRecordService = salaryRecordService;
    }

    @GetMapping
    public List<SalaryRecordResponse> getSalaryHistory(
            @PathVariable Long employeeId) {
        return salaryRecordService.findHistory(employeeId);
    }

    @PostMapping
    public SalaryRecordResponse createSalaryRecord(
            @PathVariable Long employeeId,
            @Valid @RequestBody CreateSalaryRecordRequest request) {
        return salaryRecordService.createSalaryRecord(employeeId, request);
    }
}
