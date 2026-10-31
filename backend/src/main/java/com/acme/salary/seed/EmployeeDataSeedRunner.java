package com.acme.salary.seed;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(
        name = "app.seed.generate",
        havingValue = "true"
)
public class EmployeeDataSeedRunner implements ApplicationRunner {

    private final EmployeeDataGenerator employeeDataGenerator;

    public EmployeeDataSeedRunner(
            EmployeeDataGenerator employeeDataGenerator
    ) {
        this.employeeDataGenerator = employeeDataGenerator;
    }

    @Override
    public void run(ApplicationArguments args) {
        employeeDataGenerator.generateData();
    }
}