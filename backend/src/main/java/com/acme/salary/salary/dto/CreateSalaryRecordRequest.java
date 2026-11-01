package com.acme.salary.salary.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateSalaryRecordRequest(
        @NotNull @DecimalMin(value = "0.01") BigDecimal annualSalary,
        @NotBlank @Pattern(regexp = "^[A-Z]{3}$") String currencyCode,
        @NotNull LocalDate effectiveFrom,
        @NotBlank @Pattern(regexp = "^(INITIAL|PROMOTION|ANNUAL_INCREMENT|MARKET_ADJUSTMENT|ROLE_CHANGE|CORRECTION|OTHER)$") String revisionReason,
        @Size(max = 500) String revisionNotes
) {}
