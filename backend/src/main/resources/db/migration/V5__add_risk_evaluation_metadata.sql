ALTER TABLE risk_assessments
    ADD COLUMN methodology_version VARCHAR(20) NOT NULL DEFAULT 'v1',
    ADD COLUMN explanation TEXT NOT NULL DEFAULT 'Calculated by GovernAI risk engine v1.';
