ALTER TABLE salary_records ADD COLUMN revision_reason VARCHAR(60) NOT NULL DEFAULT 'INITIAL';
ALTER TABLE salary_records ADD COLUMN revision_notes VARCHAR(500);

CREATE INDEX idx_salary_effective_from ON salary_records(effective_from);
CREATE INDEX idx_salary_created_at ON salary_records(created_at);

CREATE TABLE saved_reports (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    report_type VARCHAR(60) NOT NULL,
    configuration JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
