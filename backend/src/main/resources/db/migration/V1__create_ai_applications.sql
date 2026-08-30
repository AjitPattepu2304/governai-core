CREATE TABLE ai_applications
(
    id            BIGSERIAL PRIMARY KEY,
    name          VARCHAR(255)  NOT NULL,
    purpose       VARCHAR(2000) NOT NULL,
    owner         VARCHAR(255)  NOT NULL,
    business_unit VARCHAR(255)  NOT NULL,
    risk_level    VARCHAR(20)   NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    status        VARCHAR(20)   NOT NULL CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at    TIMESTAMPTZ   NOT NULL
);
