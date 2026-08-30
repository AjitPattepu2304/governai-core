-- Complete the tenancy migration prepared by V6.
-- Existing demo records are assigned to the first organization. If more than one
-- organization exists with legacy unassigned records, fail rather than silently
-- assigning records to the wrong tenant.
DO
$$
DECLARE
organization_count BIGINT;
    unassigned_count
BIGINT;
    target_organization_id
BIGINT;
BEGIN
SELECT COUNT(*)
INTO unassigned_count
FROM ai_applications
WHERE organization_id IS NULL;

IF
unassigned_count > 0 THEN
SELECT COUNT(*), MIN(id)
INTO organization_count, target_organization_id
FROM organizations;

IF
organization_count = 0 THEN
            RAISE EXCEPTION 'Cannot assign legacy AI systems: no organizations exist';
END IF;

        IF
organization_count > 1 THEN
            RAISE EXCEPTION 'Cannot safely assign % legacy AI systems across % organizations', unassigned_count, organization_count;
END IF;

UPDATE ai_applications
SET organization_id = target_organization_id
WHERE organization_id IS NULL;
END IF;
END $$;

ALTER TABLE ai_applications
    ALTER COLUMN organization_id SET NOT NULL;

ALTER TABLE ai_applications
    ADD CONSTRAINT fk_ai_applications_organization
        FOREIGN KEY (organization_id) REFERENCES organizations (id) ON DELETE CASCADE;
