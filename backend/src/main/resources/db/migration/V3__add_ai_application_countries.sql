CREATE TABLE ai_application_countries (
    ai_application_id BIGINT NOT NULL,
    country_code VARCHAR(2) NOT NULL,
    PRIMARY KEY (ai_application_id, country_code),
    CONSTRAINT fk_ai_application_countries_application
        FOREIGN KEY (ai_application_id) REFERENCES ai_applications(id) ON DELETE CASCADE,
    CONSTRAINT chk_ai_application_country_code
        CHECK (country_code IN ('US', 'CA', 'IN'))
);

CREATE INDEX idx_ai_application_countries_country_code
    ON ai_application_countries(country_code);
