package com.acme.salary.employee.service;

import com.acme.salary.employee.dto.CreateEmployeeRequest;
import com.acme.salary.employee.dto.EmployeeResponse;
import com.acme.salary.employee.entity.Employee;
import com.acme.salary.employee.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.acme.salary.employee.specification.EmployeeSpecifications;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }
//
//    public List<EmployeeResponse> findAll() {
//        return employeeRepository.findAll()
//                .stream()
//                .map(this::toResponse)
//                .toList();
//    }

//    public Page<EmployeeResponse> findAll(Pageable pageable) {
//        return employeeRepository.findAll(pageable)
//                .map(this::toResponse);
//    }

    public Page<EmployeeResponse> findAll(
            String search,
            String country,
            String department,
            String status,
            Pageable pageable) {

        Specification<Employee> specification = Specification
                .where(EmployeeSpecifications.hasSearch(search))
                .and(EmployeeSpecifications.hasCountry(country))
                .and(EmployeeSpecifications.hasDepartment(department))
                .and(EmployeeSpecifications.hasStatus(status));

        return employeeRepository.findAll(specification, pageable)
                .map(this::toResponse);
    }

    public EmployeeResponse findById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found: " + id));

        return toResponse(employee);
    }

    public EmployeeResponse create(CreateEmployeeRequest request) {
        Employee employee = new Employee();

        // Generate the employee code before saving.
        Long sequenceNumber = employeeRepository.getNextEmployeeCodeSequence();
        String employeeCode = "ACME" + String.format("%05d", sequenceNumber);

        employee.setEmployeeCode(employeeCode);
        employee.setFirstName(request.firstName());
        employee.setLastName(request.lastName());
        employee.setEmail(request.email());
        employee.setCountry(request.country());
        employee.setDepartment(request.department());
        employee.setJobTitle(request.jobTitle());
        employee.setHireDate(request.hireDate());
        employee.setEmploymentStatus(request.employmentStatus());

        return toResponse(employeeRepository.save(employee));
    }

    public EmployeeResponse update(Long id, CreateEmployeeRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found: " + id));

        employee.setFirstName(request.firstName());
        employee.setLastName(request.lastName());
        employee.setEmail(request.email());
        employee.setCountry(request.country());
        employee.setDepartment(request.department());
        employee.setJobTitle(request.jobTitle());
        employee.setHireDate(request.hireDate());
        employee.setEmploymentStatus(request.employmentStatus());

        return toResponse(employeeRepository.save(employee));
    }

    public void delete(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new RuntimeException("Employee not found: " + id);
        }

        employeeRepository.deleteById(id);
    }

    private EmployeeResponse toResponse(Employee employee) {
        return new EmployeeResponse(
                employee.getId(),
                employee.getEmployeeCode(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getEmail(),
                employee.getCountry(),
                employee.getDepartment(),
                employee.getJobTitle(),
                employee.getEmploymentStatus(),
                employee.getHireDate(),
                employee.getCreatedAt(),
                employee.getUpdatedAt()
        );
    }
}