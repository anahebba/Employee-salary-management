package com.acme.salary.employee.controller;
import com.acme.salary.employee.dto.CreateEmployeeRequest;
import com.acme.salary.employee.dto.EmployeeResponse;
import com.acme.salary.employee.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

//    @GetMapping
//    public List<EmployeeResponse> getAllEmployees() {
//        return employeeService.findAll();
//    }

//    @GetMapping
//    public Page<EmployeeResponse> getAllEmployees(Pageable pageable) {
//        return employeeService.findAll(pageable);
//    }
//@GetMapping
//public Page<EmployeeResponse> getAllEmployees(
//        @PageableDefault(size = 10, sort = "firstName", direction = Sort.Direction.ASC)
//        Pageable pageable) {
//    return employeeService.findAll(pageable);
//}

    @GetMapping
    public Page<EmployeeResponse> getAllEmployees(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 10, sort = "firstName", direction = Sort.Direction.ASC)
            Pageable pageable) {

        return employeeService.findAll(
                search, country, department, status, pageable);
    }


    @GetMapping("/{id}")
    public EmployeeResponse getEmployeeById(@PathVariable Long id) {
        return employeeService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EmployeeResponse createEmployee(
            @Valid @RequestBody CreateEmployeeRequest request) {
        return employeeService.create(request);
    }

    @PutMapping("/{id}")
    public EmployeeResponse updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody CreateEmployeeRequest request) {
        return employeeService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEmployee(@PathVariable Long id) {
        employeeService.delete(id);
    }
}