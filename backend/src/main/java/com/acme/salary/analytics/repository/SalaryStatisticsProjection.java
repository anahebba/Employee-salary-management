package com.acme.salary.analytics.repository;

import java.math.BigDecimal;

public interface SalaryStatisticsProjection {

    String getCountry();

    String getCurrencyCode();

    Double getAverageSalary();

    BigDecimal getMinimumSalary();

    BigDecimal getMaximumSalary();

    Double getMedianSalary();
}