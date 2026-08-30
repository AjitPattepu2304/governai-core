CREATE TABLE organizations
(
    id           BIGSERIAL PRIMARY KEY,
    name         VARCHAR(255)             NOT NULL UNIQUE,
    country_code VARCHAR(2)               NOT NULL,
    created_at   TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE app_users
(
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(255)             NOT NULL,
    email           VARCHAR(255)             NOT NULL UNIQUE,
    password_hash   VARCHAR(255)             NOT NULL,
    organization_id BIGINT                   NOT NULL,
    role            VARCHAR(32)              NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_app_users_organization FOREIGN KEY (organization_id) REFERENCES organizations (id) ON DELETE CASCADE,
    CONSTRAINT chk_app_users_role CHECK (role IN ('ADMIN', 'AI_OWNER', 'RISK_REVIEWER', 'AUDITOR'))
);

CREATE INDEX idx_app_users_organization_id ON app_users (organization_id);
