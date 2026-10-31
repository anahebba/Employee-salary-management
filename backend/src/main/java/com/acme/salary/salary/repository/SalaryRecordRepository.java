package com.acme.salary.salary.repository;

import com.acme.salary.salary.entity.SalaryRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SalaryRecordRepository extends JpaRepository<SalaryRecord, Long> {

    List<SalaryRecord> findByEmployeeIdOrderByEffectiveFromDesc(Long employeeId);
}