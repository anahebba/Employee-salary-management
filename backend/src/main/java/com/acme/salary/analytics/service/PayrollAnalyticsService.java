package com.acme.salary.analytics.service;
import com.acme.salary.analytics.dto.HeadcountSummaryResponse;
import com.acme.salary.analytics.dto.PayrollSummaryResponse;
import com.acme.salary.analytics.repository.PayrollAnalyticsRepository;
import com.acme.salary.employee.entity.EmploymentStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.acme.salary.analytics.dto.SalaryStatisticsResponse;
import java.time.LocalDate;
import java.util.List;
import com.acme.salary.analytics.repository.SalaryStatisticsProjection;

@Service
public class PayrollAnalyticsService {

    private final PayrollAnalyticsRepository payrollAnalyticsRepository;

    public PayrollAnalyticsService(
            PayrollAnalyticsRepository payrollAnalyticsRepository) {
        this.payrollAnalyticsRepository = payrollAnalyticsRepository;
    }

    @Transactional(readOnly = true)
    public List<PayrollSummaryResponse> getPayrollSummary() {
        return payrollAnalyticsRepository.findPayrollSummary(
                EmploymentStatus.ACTIVE,
                LocalDate.now()
        );
    }

    @Transactional(readOnly = true)
    public List<HeadcountSummaryResponse> getHeadcountSummary() {
        return payrollAnalyticsRepository.findHeadcountSummary(
                EmploymentStatus.ACTIVE
        );
    }

    @Transactional(readOnly = true)
    public List<SalaryStatisticsResponse> getSalaryStatistics() {

        List<SalaryStatisticsProjection> results =
                payrollAnalyticsRepository.findSalaryStatisticsWithMedian(
                        EmploymentStatus.ACTIVE.name(),
                        LocalDate.now()
                );

        return results.stream()
                .map(result -> new SalaryStatisticsResponse(
                        result.getCountry(),
                        result.getCurrencyCode(),
                        result.getAverageSalary(),
                        result.getMinimumSalary(),
                        result.getMaximumSalary(),
                        result.getMedianSalary()
                ))
                .toList();
    }
}