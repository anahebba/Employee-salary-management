
package com.acme.salary.employee.specification;

import com.acme.salary.employee.entity.Employee;
import com.acme.salary.employee.entity.EmploymentStatus;
import org.springframework.data.jpa.domain.Specification;

public class EmployeeSpecifications {

    private EmployeeSpecifications() {
    }


    public static Specification<Employee> hasSearch(String search) {
        return (root, query, criteriaBuilder) -> {
            if (search == null || search.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            String normalizedSearch = search.trim().toLowerCase();
            String pattern = "%" + normalizedSearch + "%";

            return criteriaBuilder.or(
                    // First name
                    criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("firstName")),
                            pattern
                    ),

                    // Last name
                    criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("lastName")),
                            pattern
                    ),

                    // Full name: first name + space + last name
                    criteriaBuilder.like(
                            criteriaBuilder.lower(
                                    criteriaBuilder.concat(
                                            criteriaBuilder.concat(
                                                    root.get("firstName"),
                                                    " "
                                            ),
                                            root.get("lastName")
                                    )
                            ),
                            pattern
                    ),

                    // Email
                    criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("email")),
                            pattern
                    ),

                    // Employee code
                    criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("employeeCode")),
                            pattern
                    ),

                    // Country
                    criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("country")),
                            pattern
                    ),

                    // Department
                    criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("department")),
                            pattern
                    ),

                    // Job title
                    criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("jobTitle")),
                            pattern
                    ),

                    // Employment status
                    criteriaBuilder.like(
                            criteriaBuilder.lower(
                                    root.get("employmentStatus").as(String.class)
                            ),
                            pattern
                    )
            );
        };
    }

    public static Specification<Employee> hasCountry(String country) {
        return (root, query, criteriaBuilder) ->
                country == null || country.isBlank()
                        ? criteriaBuilder.conjunction()
                        : criteriaBuilder.equal(
                        criteriaBuilder.lower(root.get("country")),
                        country.trim().toLowerCase()
                );
    }

    public static Specification<Employee> hasDepartment(String department) {
        return (root, query, criteriaBuilder) ->
                department == null || department.isBlank()
                        ? criteriaBuilder.conjunction()
                        : criteriaBuilder.equal(
                        criteriaBuilder.lower(root.get("department")),
                        department.trim().toLowerCase()
                );
    }

    public static Specification<Employee> hasStatus(String status) {
        return (root, query, criteriaBuilder) -> {
            if (status == null || status.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            EmploymentStatus employmentStatus =
                    EmploymentStatus.valueOf(status.trim().toUpperCase());

            return criteriaBuilder.equal(
                    root.get("employmentStatus"),
                    employmentStatus
            );
        };
    }
}
