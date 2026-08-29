ALTER TABLE ai_applications ADD COLUMN organization_id BIGINT;

CREATE INDEX idx_ai_applications_organization_id ON ai_applications(organization_id);

-- Existing local/demo records are intentionally left nullable for this migration.
-- The next tenant-isolation migration will assign legacy records to an organization
-- before organization-scoped reads and writes are enforced.
