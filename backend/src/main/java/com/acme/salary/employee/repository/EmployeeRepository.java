package com.acme.salary.employee.repository;

import com.acme.salary.employee.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long>,
        JpaSpecificationExecutor<Employee> {

    @Query(value = "SELECT nextval('employee_code_seq')", nativeQuery = true)
    Long getNextEmployeeCodeSequence();
}

