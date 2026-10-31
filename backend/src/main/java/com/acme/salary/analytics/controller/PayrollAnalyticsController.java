package com.acme.salary.analytics.controller;

import com.acme.salary.analytics.dto.PayrollSummaryResponse;
import com.acme.salary.analytics.service.PayrollAnalyticsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.acme.salary.analytics.dto.HeadcountSummaryResponse;
import java.util.List;
import com.acme.salary.analytics.dto.SalaryStatisticsResponse;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:5173")
public class PayrollAnalyticsController {

    private final PayrollAnalyticsService payrollAnalyticsService;

    public PayrollAnalyticsController(
            PayrollAnalyticsService payrollAnalyticsService) {
        this.payrollAnalyticsService = payrollAnalyticsService;
    }

    @GetMapping("/payroll-summary")
    public List<PayrollSummaryResponse> getPayrollSummary() {
        return payrollAnalyticsService.getPayrollSummary();
    }

    @GetMapping("/headcount-summary")
    public List<HeadcountSummaryResponse> getHeadcountSummary() {
        return payrollAnalyticsService.getHeadcountSummary();
    }

    @GetMapping("/salary-statistics")
    public List<SalaryStatisticsResponse> getSalaryStatistics() {
        return payrollAnalyticsService.getSalaryStatistics();
    }
}