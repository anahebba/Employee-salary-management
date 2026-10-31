package com.acme.salary.employee.dto;

import com.acme.salary.employee.entity.EmploymentStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CreateEmployeeRequest(

        @NotBlank
        @Size(max = 100)
        String firstName,

        @NotBlank
        @Size(max = 100)
        String lastName,

        @NotBlank
        @Email
        @Size(max = 255)
        String email,

        @NotBlank
        @Size(max = 100)
        String country,

        @NotBlank
        @Size(max = 100)
        String department,

        @NotBlank
        @Size(max = 150)
        String jobTitle,

        @NotNull
        @PastOrPresent
        LocalDate hireDate,

        @NotNull
        EmploymentStatus employmentStatus
) {
}