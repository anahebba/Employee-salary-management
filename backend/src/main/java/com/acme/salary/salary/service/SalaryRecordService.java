
package com.acme.salary.salary.service;

import com.acme.salary.employee.entity.Employee;
import com.acme.salary.employee.repository.EmployeeRepository;
import com.acme.salary.salary.dto.CreateSalaryRecordRequest;
import com.acme.salary.salary.dto.SalaryRecordResponse;
import com.acme.salary.salary.entity.SalaryRecord;
import com.acme.salary.salary.repository.SalaryRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SalaryRecordService {

    private final SalaryRecordRepository salaryRecordRepository;
    private final EmployeeRepository employeeRepository;

    public SalaryRecordService(
            SalaryRecordRepository salaryRecordRepository,
            EmployeeRepository employeeRepository) {
        this.salaryRecordRepository = salaryRecordRepository;
        this.employeeRepository = employeeRepository;
    }

    @Transactional(readOnly = true)
    public List<SalaryRecordResponse> findHistory(Long employeeId) {

        if (!employeeRepository.existsById(employeeId)) {
            throw new RuntimeException("Employee not found: " + employeeId);
        }

        List<SalaryRecord> history =
                salaryRecordRepository
                        .findByEmployeeIdOrderByEffectiveFromDesc(employeeId);

        return history.stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public SalaryRecordResponse createSalaryRecord(
            Long employeeId,
            CreateSalaryRecordRequest request) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException(
                        "Employee not found: " + employeeId
                ));

        List<SalaryRecord> history =
                salaryRecordRepository
                        .findByEmployeeIdOrderByEffectiveFromDesc(employeeId);

        if (!history.isEmpty()) {
            SalaryRecord latestRecord = history.get(0);

            if (!request.effectiveFrom().isAfter(latestRecord.getEffectiveFrom())) {
                throw new RuntimeException(
                        "New salary effective date must be after the latest salary record date"
                );
            }

            latestRecord.setEffectiveTo(
                    request.effectiveFrom().minusDays(1)
            );

            salaryRecordRepository.save(latestRecord);
        }

        SalaryRecord newRecord = new SalaryRecord();
        newRecord.setEmployee(employee);
        newRecord.setAnnualSalary(request.annualSalary());
        newRecord.setCurrencyCode(request.currencyCode());
        newRecord.setEffectiveFrom(request.effectiveFrom());
        newRecord.setRevisionReason(request.revisionReason());
        newRecord.setRevisionNotes(request.revisionNotes());

        SalaryRecord savedRecord =
                salaryRecordRepository.save(newRecord);

        return toResponse(savedRecord);
    }

    private SalaryRecordResponse toResponse(SalaryRecord record) {
        return new SalaryRecordResponse(
                record.getId(),
                record.getEmployee().getId(),
                record.getAnnualSalary(),
                record.getCurrencyCode(),
                record.getEffectiveFrom(),
                record.getEffectiveTo(),
                record.getCreatedAt(),
                record.getRevisionReason(),
                record.getRevisionNotes()
        );
    }
}
