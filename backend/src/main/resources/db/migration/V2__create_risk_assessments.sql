CREATE TABLE risk_assessments
(
    id                 BIGSERIAL PRIMARY KEY,
    ai_application_id  BIGINT        NOT NULL REFERENCES ai_applications (id),
    privacy_score      INTEGER       NOT NULL CHECK (privacy_score BETWEEN 0 AND 100),
    security_score     INTEGER       NOT NULL CHECK (security_score BETWEEN 0 AND 100),
    fairness_score     INTEGER       NOT NULL CHECK (fairness_score BETWEEN 0 AND 100),
    transparency_score INTEGER       NOT NULL CHECK (transparency_score BETWEEN 0 AND 100),
    regulatory_score   INTEGER       NOT NULL CHECK (regulatory_score BETWEEN 0 AND 100),
    overall_score      NUMERIC(5, 2) NOT NULL,
    risk_level         VARCHAR(20)   NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    created_at         TIMESTAMPTZ   NOT NULL
);
CREATE INDEX idx_risk_assessments_ai_application ON risk_assessments (ai_application_id);
