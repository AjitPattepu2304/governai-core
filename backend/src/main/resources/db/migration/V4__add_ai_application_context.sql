ALTER TABLE ai_applications
    ADD COLUMN ai_type VARCHAR(30) NOT NULL DEFAULT 'OTHER',
    ADD COLUMN lifecycle VARCHAR(20) NOT NULL DEFAULT 'DEVELOPMENT',
    ADD COLUMN decision_impact VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    ADD COLUMN human_oversight VARCHAR(20) NOT NULL DEFAULT 'HUMAN_REVIEW',
    ADD COLUMN personal_data BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN sensitive_data BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN external_ai_provider BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE ai_applications
    ADD CONSTRAINT chk_ai_application_ai_type CHECK (ai_type IN ('GENERATIVE_AI','PREDICTIVE_ML','COMPUTER_VISION','RECOMMENDATION','OTHER')),
    ADD CONSTRAINT chk_ai_application_lifecycle CHECK (lifecycle IN ('DEVELOPMENT','TESTING','PRODUCTION','RETIRED')),
    ADD CONSTRAINT chk_ai_application_decision_impact CHECK (decision_impact IN ('LOW','MEDIUM','HIGH','CRITICAL')),
    ADD CONSTRAINT chk_ai_application_human_oversight CHECK (human_oversight IN ('NONE','HUMAN_REVIEW','HUMAN_APPROVAL'));
