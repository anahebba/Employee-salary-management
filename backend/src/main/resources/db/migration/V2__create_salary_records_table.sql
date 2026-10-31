CREATE TABLE salary_records (
                                id BIGSERIAL PRIMARY KEY,
                                employee_id BIGINT NOT NULL,
                                annual_salary NUMERIC(15, 2) NOT NULL,
                                currency_code VARCHAR(3) NOT NULL,
                                effective_from DATE NOT NULL,
                                effective_to DATE,
                                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                CONSTRAINT fk_salary_employee
                                    FOREIGN KEY (employee_id)
                                        REFERENCES employees(id),

                                CONSTRAINT chk_salary_positive
                                    CHECK (annual_salary > 0),

                                CONSTRAINT chk_salary_dates
                                    CHECK (effective_to IS NULL OR effective_to > effective_from),

                                CONSTRAINT uq_employee_salary_start
                                    UNIQUE (employee_id, effective_from)
);

CREATE INDEX idx_salary_employee_effective
    ON salary_records(employee_id, effective_from DESC);