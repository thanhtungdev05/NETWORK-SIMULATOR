-- 014: Add the normalized employee, organization, curriculum, assignment,
-- attempt and import-lineage model described in the DB/dashboard assessment.
--
-- Compatibility policy:
--   * No legacy table or column is dropped.
--   * users remains the authentication source while employees becomes the
--     canonical personnel profile.
--   * timer_sessions remains readable by the current API. Its rows are copied
--     to lab_attempts only when a user, employee, enrollment and catalog lab
--     can be resolved without guessing identities.
--   * Historical assignments reconstructed from timer_sessions are explicitly
--     marked is_inferred = TRUE / assignment_source = 'legacy_observed'. They
--     must not be presented as authoritative curriculum assignments.
--
-- The migration is intentionally idempotent so it can be retried as one unit.

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

-- ---------------------------------------------------------------------------
-- Import and seed lineage
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS data_batches (
    batch_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_key VARCHAR(160) NOT NULL UNIQUE,
    batch_type VARCHAR(30) NOT NULL,
    source_name TEXT,
    source_checksum CHAR(64),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    row_count INTEGER NOT NULL DEFAULT 0,
    accepted_count INTEGER NOT NULL DEFAULT 0,
    rejected_count INTEGER NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_by_user_id UUID,
    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT data_batches_created_by_fkey
        FOREIGN KEY (created_by_user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    CONSTRAINT data_batches_type_check
        CHECK (batch_type IN ('employee_import', 'class_import', 'session_import', 'mock_seed', 'migration_backfill', 'other')),
    CONSTRAINT data_batches_status_check
        CHECK (status IN ('pending', 'validating', 'applied', 'partially_applied', 'failed', 'rolled_back')),
    CONSTRAINT data_batches_checksum_check
        CHECK (source_checksum IS NULL OR source_checksum ~ '^[0-9a-f]{64}$'),
    CONSTRAINT data_batches_counts_check
        CHECK (row_count >= 0 AND accepted_count >= 0 AND rejected_count >= 0),
    CONSTRAINT data_batches_metadata_check
        CHECK (jsonb_typeof(metadata) = 'object'),
    CONSTRAINT data_batches_time_check
        CHECK (finished_at IS NULL OR started_at IS NULL OR finished_at >= started_at)
);

CREATE INDEX IF NOT EXISTS idx_data_batches_type_status_created
    ON data_batches (batch_type, status, created_at DESC);

WITH source_batches AS (
    SELECT NULLIF(BTRIM(employee_seed_batch), '') AS batch_key,
           BOOL_OR(FALSE) AS has_mock
      FROM users
     WHERE NULLIF(BTRIM(employee_seed_batch), '') IS NOT NULL
     GROUP BY NULLIF(BTRIM(employee_seed_batch), '')
    UNION ALL
    SELECT NULLIF(BTRIM(seed_batch), '') AS batch_key,
           BOOL_OR(is_mock) AS has_mock
      FROM timer_sessions
     WHERE NULLIF(BTRIM(seed_batch), '') IS NOT NULL
     GROUP BY NULLIF(BTRIM(seed_batch), '')
    UNION ALL
    SELECT NULLIF(BTRIM(seed_batch), '') AS batch_key,
           BOOL_OR(is_mock) AS has_mock
      FROM training_classes
     WHERE NULLIF(BTRIM(seed_batch), '') IS NOT NULL
     GROUP BY NULLIF(BTRIM(seed_batch), '')
    UNION ALL
    SELECT NULLIF(BTRIM(seed_batch), '') AS batch_key,
           BOOL_OR(is_mock) AS has_mock
      FROM class_enrollments
     WHERE NULLIF(BTRIM(seed_batch), '') IS NOT NULL
     GROUP BY NULLIF(BTRIM(seed_batch), '')
), aggregated_batches AS (
    SELECT batch_key, BOOL_OR(has_mock) AS has_mock
      FROM source_batches
     WHERE batch_key IS NOT NULL
     GROUP BY batch_key
)
INSERT INTO data_batches (
    batch_key,
    batch_type,
    source_name,
    status,
    metadata,
    started_at,
    finished_at
)
SELECT batch_key,
       CASE WHEN has_mock THEN 'mock_seed' ELSE 'migration_backfill' END,
       batch_key,
       'applied',
       jsonb_build_object(
           'backfilled_by', '014_normalized_training_model',
           'legacy_batch_key', batch_key
       ),
       NOW(),
       NOW()
  FROM aggregated_batches
ON CONFLICT (batch_key) DO UPDATE
SET updated_at = NOW(),
    metadata = data_batches.metadata || EXCLUDED.metadata;

-- ---------------------------------------------------------------------------
-- Organization and employee master data
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS branches (
    branch_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_code VARCHAR(50) NOT NULL UNIQUE,
    branch_name TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    effective_from DATE,
    effective_to DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT branches_code_check CHECK (BTRIM(branch_code) <> ''),
    CONSTRAINT branches_name_check CHECK (BTRIM(branch_name) <> ''),
    CONSTRAINT branches_dates_check
        CHECK (effective_to IS NULL OR effective_from IS NULL OR effective_to >= effective_from)
);

CREATE TABLE IF NOT EXISTS regions (
    region_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL,
    region_code VARCHAR(80) NOT NULL UNIQUE,
    region_name TEXT NOT NULL,
    dashboard_group VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    effective_from DATE,
    effective_to DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT regions_branch_fkey
        FOREIGN KEY (branch_id) REFERENCES branches(branch_id) ON DELETE RESTRICT,
    CONSTRAINT regions_code_check CHECK (BTRIM(region_code) <> ''),
    CONSTRAINT regions_name_check CHECK (BTRIM(region_name) <> ''),
    CONSTRAINT regions_dates_check
        CHECK (effective_to IS NULL OR effective_from IS NULL OR effective_to >= effective_from)
);

CREATE INDEX IF NOT EXISTS idx_regions_branch_active
    ON regions (branch_id, is_active, region_code);
CREATE INDEX IF NOT EXISTS idx_regions_dashboard_group
    ON regions (dashboard_group)
    WHERE dashboard_group IS NOT NULL;

CREATE TABLE IF NOT EXISTS org_units (
    unit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region_id UUID NOT NULL,
    parent_unit_id UUID,
    unit_code VARCHAR(100) NOT NULL UNIQUE,
    unit_name TEXT NOT NULL,
    unit_type VARCHAR(30) NOT NULL DEFAULT 'operational',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    effective_from DATE,
    effective_to DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT org_units_region_fkey
        FOREIGN KEY (region_id) REFERENCES regions(region_id) ON DELETE RESTRICT,
    CONSTRAINT org_units_parent_fkey
        FOREIGN KEY (parent_unit_id) REFERENCES org_units(unit_id) ON DELETE RESTRICT,
    CONSTRAINT org_units_code_check CHECK (BTRIM(unit_code) <> ''),
    CONSTRAINT org_units_name_check CHECK (BTRIM(unit_name) <> ''),
    CONSTRAINT org_units_type_check
        CHECK (unit_type IN ('region_root', 'branch', 'center', 'team', 'operational', 'other')),
    CONSTRAINT org_units_dates_check
        CHECK (effective_to IS NULL OR effective_from IS NULL OR effective_to >= effective_from),
    CONSTRAINT org_units_not_self_parent_check
        CHECK (parent_unit_id IS NULL OR parent_unit_id <> unit_id)
);

CREATE INDEX IF NOT EXISTS idx_org_units_region_active
    ON org_units (region_id, is_active, unit_code);
CREATE INDEX IF NOT EXISTS idx_org_units_parent
    ON org_units (parent_unit_id)
    WHERE parent_unit_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS employees (
    employee_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_code VARCHAR(20) NOT NULL UNIQUE,
    user_id UUID UNIQUE,
    full_name TEXT NOT NULL,
    email CITEXT UNIQUE,
    job_title TEXT,
    employment_status VARCHAR(20) NOT NULL DEFAULT 'active',
    employment_start_date DATE,
    employment_end_date DATE,
    training_start_date DATE,
    training_end_date DATE,
    termination_reason TEXT,
    source_system TEXT,
    source_data_batch_id UUID,
    source_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT employees_user_fkey
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    CONSTRAINT employees_source_batch_fkey
        FOREIGN KEY (source_data_batch_id) REFERENCES data_batches(batch_id) ON DELETE SET NULL,
    CONSTRAINT employees_code_check CHECK (BTRIM(employee_code) <> ''),
    CONSTRAINT employees_name_check CHECK (BTRIM(full_name) <> ''),
    CONSTRAINT employees_status_check
        CHECK (employment_status IN ('active', 'on_leave', 'terminated', 'inactive')),
    CONSTRAINT employees_dates_check
        CHECK (
            employment_end_date IS NULL
            OR employment_start_date IS NULL
            OR employment_end_date >= employment_start_date
        ),
    CONSTRAINT employees_training_dates_check
        CHECK (
            training_end_date IS NULL
            OR training_start_date IS NULL
            OR training_end_date >= training_start_date
        ),
    CONSTRAINT employees_metadata_check
        CHECK (jsonb_typeof(source_metadata) = 'object')
);

CREATE INDEX IF NOT EXISTS idx_employees_status_name
    ON employees (employment_status, full_name, employee_code);
CREATE INDEX IF NOT EXISTS idx_employees_source_batch
    ON employees (source_data_batch_id)
    WHERE source_data_batch_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS employee_org_assignments (
    employee_org_assignment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL,
    unit_id UUID NOT NULL,
    valid_from DATE NOT NULL,
    valid_to DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    assignment_source VARCHAR(30) NOT NULL DEFAULT 'explicit',
    is_inferred BOOLEAN NOT NULL DEFAULT FALSE,
    data_batch_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT employee_org_assignments_employee_fkey
        FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE RESTRICT,
    CONSTRAINT employee_org_assignments_unit_fkey
        FOREIGN KEY (unit_id) REFERENCES org_units(unit_id) ON DELETE RESTRICT,
    CONSTRAINT employee_org_assignments_batch_fkey
        FOREIGN KEY (data_batch_id) REFERENCES data_batches(batch_id) ON DELETE SET NULL,
    CONSTRAINT employee_org_assignments_status_check
        CHECK (status IN ('active', 'ended', 'cancelled')),
    CONSTRAINT employee_org_assignments_source_check
        CHECK (assignment_source IN ('explicit', 'employee_import', 'legacy_roster', 'other')),
    CONSTRAINT employee_org_assignments_dates_check
        CHECK (valid_to IS NULL OR valid_to >= valid_from),
    CONSTRAINT employee_org_assignments_unique
        UNIQUE (employee_id, unit_id, valid_from)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_employee_org_one_current
    ON employee_org_assignments (employee_id)
    WHERE status = 'active' AND valid_to IS NULL;
CREATE INDEX IF NOT EXISTS idx_employee_org_unit_dates
    ON employee_org_assignments (unit_id, valid_from, valid_to, status);
CREATE INDEX IF NOT EXISTS idx_employee_org_employee_dates
    ON employee_org_assignments (employee_id, valid_from DESC, valid_to);

-- Branches imported from the legacy roster retain their source codes. A
-- placeholder branch is created only when a region/class has no branch code.
INSERT INTO branches (branch_code, branch_name)
SELECT source.branch_code, source.branch_code
  FROM (
        SELECT DISTINCT NULLIF(BTRIM(branch_code), '') AS branch_code
          FROM users
       ) source
 WHERE source.branch_code IS NOT NULL
ON CONFLICT (branch_code) DO UPDATE
SET branch_name = EXCLUDED.branch_name,
    updated_at = NOW();

INSERT INTO branches (branch_code, branch_name)
SELECT 'UNASSIGNED', 'Chưa xác định chi nhánh'
 WHERE EXISTS (
        SELECT 1
          FROM users
         WHERE NULLIF(BTRIM(COALESCE(region_code, dashboard_region)), '') IS NOT NULL
           AND NULLIF(BTRIM(branch_code), '') IS NULL
        UNION ALL
        SELECT 1
          FROM training_classes
         WHERE NULLIF(BTRIM(region_name), '') IS NOT NULL
           AND NOT EXISTS (
                SELECT 1
                  FROM users
                 WHERE NULLIF(BTRIM(branch_code), '') IS NOT NULL
                   AND (
                        BTRIM(dashboard_region) = BTRIM(training_classes.region_name)
                        OR BTRIM(region_code) = BTRIM(training_classes.region_name)
                   )
           )
     )
ON CONFLICT (branch_code) DO NOTHING;

WITH roster_regions AS (
    SELECT DISTINCT ON (normalized_region_code)
           normalized_region_code AS region_code,
           COALESCE(NULLIF(BTRIM(dashboard_region), ''), NULLIF(BTRIM(region_code), '')) AS region_name,
           NULLIF(BTRIM(dashboard_region), '') AS dashboard_group,
           COALESCE(NULLIF(BTRIM(branch_code), ''), 'UNASSIGNED') AS branch_code
      FROM (
            SELECT users.*,
                   COALESCE(
                       NULLIF(BTRIM(region_code), ''),
                       CASE
                           WHEN NULLIF(BTRIM(dashboard_region), '') IS NOT NULL
                           THEN 'DASH-' || UPPER(SUBSTRING(MD5(BTRIM(dashboard_region)) FROM 1 FOR 12))
                       END
                   ) AS normalized_region_code
              FROM users
           ) roster
     WHERE normalized_region_code IS NOT NULL
       AND COALESCE(NULLIF(BTRIM(dashboard_region), ''), NULLIF(BTRIM(region_code), '')) IS NOT NULL
     ORDER BY normalized_region_code,
              CASE WHEN NULLIF(BTRIM(branch_code), '') IS NULL THEN 1 ELSE 0 END,
              branch_code
)
INSERT INTO regions (
    branch_id,
    region_code,
    region_name,
    dashboard_group
)
SELECT branch.branch_id,
       roster.region_code,
       roster.region_name,
       roster.dashboard_group
  FROM roster_regions roster
  JOIN branches branch ON branch.branch_code = roster.branch_code
ON CONFLICT (region_code) DO UPDATE
SET branch_id = EXCLUDED.branch_id,
    region_name = EXCLUDED.region_name,
    dashboard_group = COALESCE(EXCLUDED.dashboard_group, regions.dashboard_group),
    updated_at = NOW();

-- Preserve class regions that were not present in users. Their generated code
-- is deterministic, and the human label remains available in region_name.
INSERT INTO regions (
    branch_id,
    region_code,
    region_name,
    dashboard_group
)
SELECT unassigned.branch_id,
       'CLASS-' || UPPER(SUBSTRING(MD5(BTRIM(training.region_name)) FROM 1 FOR 12)),
       BTRIM(training.region_name),
       BTRIM(training.region_name)
  FROM (
        SELECT DISTINCT region_name
          FROM training_classes
         WHERE NULLIF(BTRIM(region_name), '') IS NOT NULL
       ) training
  JOIN branches unassigned ON unassigned.branch_code = 'UNASSIGNED'
 WHERE NOT EXISTS (
        SELECT 1
          FROM regions region
         WHERE BTRIM(region.region_name) = BTRIM(training.region_name)
            OR BTRIM(COALESCE(region.dashboard_group, '')) = BTRIM(training.region_name)
     )
ON CONFLICT (region_code) DO NOTHING;

-- Every region receives a stable root unit. Actual roster units are attached
-- below it so employee history always has a valid unit foreign key.
INSERT INTO org_units (
    region_id,
    unit_code,
    unit_name,
    unit_type
)
SELECT region_id,
       '@REGION:' || region_code,
       region_name,
       'region_root'
  FROM regions
ON CONFLICT (unit_code) DO UPDATE
SET region_id = EXCLUDED.region_id,
    unit_name = EXCLUDED.unit_name,
    updated_at = NOW();

WITH roster_units AS (
    SELECT DISTINCT ON (normalized_unit_code)
           normalized_unit_code AS unit_code,
           COALESCE(NULLIF(BTRIM(unit_name), ''), normalized_unit_code) AS unit_name,
           NULLIF(BTRIM(region_code), '') AS source_region_code,
           NULLIF(BTRIM(dashboard_region), '') AS dashboard_region
      FROM (
            SELECT users.*,
                   NULLIF(BTRIM(unit_code), '') AS normalized_unit_code
              FROM users
           ) roster
     WHERE normalized_unit_code IS NOT NULL
     ORDER BY normalized_unit_code,
              CASE WHEN NULLIF(BTRIM(region_code), '') IS NULL THEN 1 ELSE 0 END,
              region_code,
              unit_name
), resolved_units AS (
    SELECT roster.*,
           region.region_id,
           root.unit_id AS parent_unit_id
      FROM roster_units roster
      JOIN LATERAL (
            SELECT candidate.region_id, candidate.region_code
              FROM regions candidate
             WHERE candidate.region_code = roster.source_region_code
                OR BTRIM(COALESCE(candidate.dashboard_group, '')) = BTRIM(COALESCE(roster.dashboard_region, ''))
                OR BTRIM(candidate.region_name) = BTRIM(COALESCE(roster.dashboard_region, ''))
             ORDER BY CASE WHEN candidate.region_code = roster.source_region_code THEN 0 ELSE 1 END,
                      candidate.region_code
             LIMIT 1
           ) region ON TRUE
      JOIN org_units root
        ON root.region_id = region.region_id
       AND root.unit_type = 'region_root'
)
INSERT INTO org_units (
    region_id,
    parent_unit_id,
    unit_code,
    unit_name,
    unit_type
)
SELECT region_id,
       parent_unit_id,
       unit_code,
       unit_name,
       'operational'
  FROM resolved_units
ON CONFLICT (unit_code) DO UPDATE
SET region_id = EXCLUDED.region_id,
    parent_unit_id = EXCLUDED.parent_unit_id,
    unit_name = EXCLUDED.unit_name,
    updated_at = NOW();

WITH ranked_users AS (
    SELECT roster.*,
           ROW_NUMBER() OVER (
               PARTITION BY LOWER(BTRIM(roster.email))
               ORDER BY roster.user_id
           ) AS email_rank,
           ROW_NUMBER() OVER (
               PARTITION BY BTRIM(roster.employee_id)
               ORDER BY roster.updated_at DESC, roster.user_id
           ) AS employee_code_rank
      FROM users roster
     WHERE NULLIF(BTRIM(roster.employee_id), '') IS NOT NULL
)
INSERT INTO employees (
    employee_code,
    user_id,
    full_name,
    email,
    job_title,
    employment_status,
    employment_start_date,
    employment_end_date,
    training_start_date,
    training_end_date,
    termination_reason,
    source_system,
    source_data_batch_id,
    source_metadata,
    synced_at,
    created_at,
    updated_at
)
SELECT BTRIM(roster.employee_id),
       roster.user_id,
       COALESCE(NULLIF(BTRIM(roster.display_name), ''), BTRIM(roster.employee_id)),
       CASE WHEN roster.email_rank = 1 THEN NULLIF(BTRIM(roster.email), '')::citext END,
       NULLIF(BTRIM(roster.job_title), ''),
       CASE WHEN roster.is_terminated THEN 'terminated' ELSE 'active' END,
       NULL,
       roster.termination_date,
       roster.training_start_date,
       roster.training_end_date,
       NULLIF(BTRIM(roster.termination_reason), ''),
       NULLIF(BTRIM(roster.employee_source), ''),
       batch.batch_id,
       jsonb_strip_nulls(jsonb_build_object(
           'legacy_user_email', roster.email,
           'source_class_code', roster.class_code,
           'legacy_branch_code', roster.branch_code,
           'legacy_region_code', roster.region_code,
           'legacy_dashboard_region', roster.dashboard_region,
           'legacy_unit_code', roster.unit_code
       )),
       roster.employee_synced_at,
       roster.created_at,
       roster.updated_at
  FROM ranked_users roster
  LEFT JOIN data_batches batch
    ON batch.batch_key = NULLIF(BTRIM(roster.employee_seed_batch), '')
 WHERE roster.employee_code_rank = 1
ON CONFLICT (employee_code) DO UPDATE
SET user_id = EXCLUDED.user_id,
    full_name = EXCLUDED.full_name,
    email = COALESCE(EXCLUDED.email, employees.email),
    job_title = EXCLUDED.job_title,
    employment_status = EXCLUDED.employment_status,
    employment_start_date = EXCLUDED.employment_start_date,
    employment_end_date = EXCLUDED.employment_end_date,
    training_start_date = EXCLUDED.training_start_date,
    training_end_date = EXCLUDED.training_end_date,
    termination_reason = EXCLUDED.termination_reason,
    source_system = EXCLUDED.source_system,
    source_data_batch_id = COALESCE(EXCLUDED.source_data_batch_id, employees.source_data_batch_id),
    source_metadata = employees.source_metadata || EXCLUDED.source_metadata,
    synced_at = COALESCE(EXCLUDED.synced_at, employees.synced_at),
    updated_at = NOW();

WITH roster_assignment_source AS (
    SELECT employee.employee_id,
           roster.user_id,
           roster.training_start_date,
           roster.termination_date,
           roster.is_terminated,
           roster.employee_synced_at,
           roster.unit_code,
           roster.region_code,
           roster.dashboard_region,
           batch.batch_id,
           COALESCE(
               roster.training_start_date,
               (
                   SELECT MIN(COALESCE(timer.started_at, timer.finished_at, timer.created_at)::date)
                     FROM timer_sessions timer
                    WHERE timer.user_id = roster.user_id
               ),
               roster.employee_synced_at::date,
               CURRENT_DATE
           ) AS inferred_valid_from
      FROM users roster
      JOIN employees employee ON employee.user_id = roster.user_id
      LEFT JOIN data_batches batch
        ON batch.batch_key = NULLIF(BTRIM(roster.employee_seed_batch), '')
), resolved_roster_assignments AS (
    SELECT source.*,
           COALESCE(actual_unit.unit_id, root_unit.unit_id) AS unit_id,
           CASE
               WHEN source.termination_date IS NULL THEN source.inferred_valid_from
               ELSE LEAST(source.inferred_valid_from, source.termination_date)
           END AS safe_valid_from
      FROM roster_assignment_source source
      LEFT JOIN org_units actual_unit
        ON actual_unit.unit_code = NULLIF(BTRIM(source.unit_code), '')
      LEFT JOIN LATERAL (
            SELECT root.unit_id
              FROM regions region
              JOIN org_units root
                ON root.region_id = region.region_id
               AND root.unit_type = 'region_root'
             WHERE region.region_code = NULLIF(BTRIM(source.region_code), '')
                OR BTRIM(COALESCE(region.dashboard_group, '')) = BTRIM(COALESCE(source.dashboard_region, ''))
                OR BTRIM(region.region_name) = BTRIM(COALESCE(source.dashboard_region, ''))
             ORDER BY CASE WHEN region.region_code = NULLIF(BTRIM(source.region_code), '') THEN 0 ELSE 1 END,
                      region.region_code
             LIMIT 1
           ) root_unit ON TRUE
)
INSERT INTO employee_org_assignments (
    employee_id,
    unit_id,
    valid_from,
    valid_to,
    status,
    assignment_source,
    is_inferred,
    data_batch_id
)
SELECT resolved.employee_id,
       resolved.unit_id,
       resolved.safe_valid_from,
       resolved.termination_date,
       CASE WHEN resolved.is_terminated THEN 'ended' ELSE 'active' END,
       'legacy_roster',
       TRUE,
       resolved.batch_id
 FROM resolved_roster_assignments resolved
 WHERE resolved.unit_id IS NOT NULL
   AND (
        resolved.is_terminated
        OR NOT EXISTS (
            SELECT 1
              FROM employee_org_assignments current_assignment
             WHERE current_assignment.employee_id = resolved.employee_id
               AND current_assignment.status = 'active'
               AND current_assignment.valid_to IS NULL
        )
   )
ON CONFLICT (employee_id, unit_id, valid_from) DO UPDATE
SET valid_to = EXCLUDED.valid_to,
    status = EXCLUDED.status,
    data_batch_id = COALESCE(EXCLUDED.data_batch_id, employee_org_assignments.data_batch_id),
    updated_at = NOW();

CREATE OR REPLACE VIEW v_employee_current_org AS
SELECT assignment.employee_org_assignment_id,
       employee.employee_id,
       employee.employee_code,
       employee.user_id,
       employee.full_name,
       employee.email,
       unit.unit_id,
       unit.unit_code,
       unit.unit_name,
       region.region_id,
       region.region_code,
       region.region_name,
       region.dashboard_group,
       branch.branch_id,
       branch.branch_code,
       branch.branch_name,
       assignment.valid_from,
       assignment.valid_to,
       assignment.assignment_source,
       assignment.is_inferred
  FROM employee_org_assignments assignment
  JOIN employees employee ON employee.employee_id = assignment.employee_id
  JOIN org_units unit ON unit.unit_id = assignment.unit_id
  JOIN regions region ON region.region_id = unit.region_id
  JOIN branches branch ON branch.branch_id = region.branch_id
 WHERE assignment.status = 'active'
   AND assignment.valid_from <= CURRENT_DATE
   AND (assignment.valid_to IS NULL OR assignment.valid_to >= CURRENT_DATE);

-- ---------------------------------------------------------------------------
-- Versioned device/lab catalog and curriculum
-- ---------------------------------------------------------------------------

ALTER TABLE device_catalog ADD COLUMN IF NOT EXISTS catalog_version VARCHAR(30) NOT NULL DEFAULT '1';
ALTER TABLE device_catalog ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE device_catalog ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;
ALTER TABLE device_catalog ADD COLUMN IF NOT EXISTS effective_from DATE;
ALTER TABLE device_catalog ADD COLUMN IF NOT EXISTS effective_to DATE;
ALTER TABLE device_catalog ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE device_catalog ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE lab_catalog ADD COLUMN IF NOT EXISTS catalog_version VARCHAR(30) NOT NULL DEFAULT '1';
ALTER TABLE lab_catalog ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE lab_catalog ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;
ALTER TABLE lab_catalog ADD COLUMN IF NOT EXISTS effective_from DATE;
ALTER TABLE lab_catalog ADD COLUMN IF NOT EXISTS effective_to DATE;
ALTER TABLE lab_catalog ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE lab_catalog ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
         WHERE conname = 'device_catalog_sort_order_check'
           AND conrelid = 'device_catalog'::regclass
    ) THEN
        ALTER TABLE device_catalog
            ADD CONSTRAINT device_catalog_sort_order_check CHECK (sort_order >= 0) NOT VALID;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
         WHERE conname = 'device_catalog_dates_check'
           AND conrelid = 'device_catalog'::regclass
    ) THEN
        ALTER TABLE device_catalog
            ADD CONSTRAINT device_catalog_dates_check
            CHECK (effective_to IS NULL OR effective_from IS NULL OR effective_to >= effective_from) NOT VALID;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
         WHERE conname = 'lab_catalog_sort_order_check'
           AND conrelid = 'lab_catalog'::regclass
    ) THEN
        ALTER TABLE lab_catalog
            ADD CONSTRAINT lab_catalog_sort_order_check CHECK (sort_order >= 0) NOT VALID;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
         WHERE conname = 'lab_catalog_dates_check'
           AND conrelid = 'lab_catalog'::regclass
    ) THEN
        ALTER TABLE lab_catalog
            ADD CONSTRAINT lab_catalog_dates_check
            CHECK (effective_to IS NULL OR effective_from IS NULL OR effective_to >= effective_from) NOT VALID;
    END IF;
END $$;

WITH ranked AS (
    SELECT device_id,
           ROW_NUMBER() OVER (ORDER BY device_name, device_id) AS new_sort_order
      FROM device_catalog
)
UPDATE device_catalog catalog
   SET sort_order = ranked.new_sort_order,
       updated_at = NOW()
  FROM ranked
 WHERE catalog.device_id = ranked.device_id
   AND catalog.sort_order = 0;

WITH ranked AS (
    SELECT lab_id,
           ROW_NUMBER() OVER (PARTITION BY device_id ORDER BY lab_id) AS new_sort_order
      FROM lab_catalog
)
UPDATE lab_catalog catalog
   SET sort_order = ranked.new_sort_order,
       updated_at = NOW()
  FROM ranked
 WHERE catalog.lab_id = ranked.lab_id
   AND catalog.sort_order = 0;

CREATE INDEX IF NOT EXISTS idx_device_catalog_active_order
    ON device_catalog (is_active, sort_order, device_id);
CREATE INDEX IF NOT EXISTS idx_lab_catalog_device_active_order
    ON lab_catalog (device_id, is_active, sort_order, lab_id);

CREATE TABLE IF NOT EXISTS curricula (
    curriculum_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curriculum_code VARCHAR(80) NOT NULL,
    version VARCHAR(30) NOT NULL,
    curriculum_name TEXT NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    effective_from DATE,
    effective_to DATE,
    data_batch_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT curricula_batch_fkey
        FOREIGN KEY (data_batch_id) REFERENCES data_batches(batch_id) ON DELETE SET NULL,
    CONSTRAINT curricula_code_check CHECK (BTRIM(curriculum_code) <> ''),
    CONSTRAINT curricula_version_check CHECK (BTRIM(version) <> ''),
    CONSTRAINT curricula_name_check CHECK (BTRIM(curriculum_name) <> ''),
    CONSTRAINT curricula_status_check
        CHECK (status IN ('draft', 'active', 'retired', 'archived')),
    CONSTRAINT curricula_dates_check
        CHECK (effective_to IS NULL OR effective_from IS NULL OR effective_to >= effective_from),
    CONSTRAINT curricula_code_version_unique UNIQUE (curriculum_code, version)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_curricula_one_active_default
    ON curricula (is_default)
    WHERE is_default = TRUE AND status = 'active';
CREATE INDEX IF NOT EXISTS idx_curricula_status_dates
    ON curricula (status, effective_from, effective_to);

CREATE TABLE IF NOT EXISTS curriculum_labs (
    curriculum_lab_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curriculum_id UUID NOT NULL,
    lab_id VARCHAR(50) NOT NULL,
    required_mode VARCHAR(20) NOT NULL DEFAULT 'practice',
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    available_offset_days INTEGER NOT NULL DEFAULT 0,
    due_offset_days INTEGER,
    passing_score NUMERIC(5, 2),
    max_attempts INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT curriculum_labs_curriculum_fkey
        FOREIGN KEY (curriculum_id) REFERENCES curricula(curriculum_id) ON DELETE RESTRICT,
    CONSTRAINT curriculum_labs_lab_fkey
        FOREIGN KEY (lab_id) REFERENCES lab_catalog(lab_id) ON DELETE RESTRICT,
    CONSTRAINT curriculum_labs_mode_check
        CHECK (required_mode IN ('practice', 'guide', 'both')),
    CONSTRAINT curriculum_labs_sort_order_check CHECK (sort_order >= 0),
    CONSTRAINT curriculum_labs_offsets_check
        CHECK (available_offset_days >= 0 AND (due_offset_days IS NULL OR due_offset_days >= available_offset_days)),
    CONSTRAINT curriculum_labs_passing_score_check
        CHECK (passing_score IS NULL OR (passing_score >= 0 AND passing_score <= 100)),
    CONSTRAINT curriculum_labs_max_attempts_check
        CHECK (max_attempts IS NULL OR max_attempts >= 1),
    CONSTRAINT curriculum_labs_unique UNIQUE (curriculum_id, lab_id, required_mode)
);

CREATE INDEX IF NOT EXISTS idx_curriculum_labs_curriculum_order
    ON curriculum_labs (curriculum_id, is_required, sort_order, lab_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_labs_lab
    ON curriculum_labs (lab_id, curriculum_id);

INSERT INTO curricula (
    curriculum_code,
    version,
    curriculum_name,
    description,
    status,
    is_default,
    effective_from
)
SELECT 'LEGACY-PORTAL-LABS',
       '1',
       'Danh mục lab portal chuyển tiếp',
       'Chương trình chuyển tiếp tạo từ lab_catalog; assignment backfill chỉ được tạo cho hoạt động quan sát được.',
       'active',
       NOT EXISTS (
           SELECT 1
             FROM curricula current_default
            WHERE current_default.is_default = TRUE
              AND current_default.status = 'active'
              AND (current_default.curriculum_code, current_default.version)
                  <> ('LEGACY-PORTAL-LABS', '1')
       ),
       CURRENT_DATE
ON CONFLICT (curriculum_code, version) DO UPDATE
SET curriculum_name = EXCLUDED.curriculum_name,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    is_default = EXCLUDED.is_default,
    updated_at = NOW();

INSERT INTO curriculum_labs (
    curriculum_id,
    lab_id,
    required_mode,
    is_required,
    sort_order
)
SELECT curriculum.curriculum_id,
       lab.lab_id,
       'practice',
       TRUE,
       lab.sort_order
  FROM curricula curriculum
 CROSS JOIN lab_catalog lab
 WHERE curriculum.curriculum_code = 'LEGACY-PORTAL-LABS'
   AND curriculum.version = '1'
   AND lab.is_active = TRUE
ON CONFLICT (curriculum_id, lab_id, required_mode) DO UPDATE
SET is_required = EXCLUDED.is_required,
    sort_order = EXCLUDED.sort_order,
    updated_at = NOW();

-- ---------------------------------------------------------------------------
-- Normalize existing class/enrollment references without breaking legacy API
-- ---------------------------------------------------------------------------

ALTER TABLE training_classes ADD COLUMN IF NOT EXISTS region_id UUID;
ALTER TABLE training_classes ADD COLUMN IF NOT EXISTS curriculum_id UUID;
ALTER TABLE training_classes ADD COLUMN IF NOT EXISTS instructor_employee_id UUID;
ALTER TABLE training_classes ADD COLUMN IF NOT EXISTS data_batch_id UUID;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
         WHERE conname = 'training_classes_region_fkey'
           AND conrelid = 'training_classes'::regclass
    ) THEN
        ALTER TABLE training_classes
            ADD CONSTRAINT training_classes_region_fkey
            FOREIGN KEY (region_id) REFERENCES regions(region_id) ON DELETE RESTRICT NOT VALID;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
         WHERE conname = 'training_classes_curriculum_fkey'
           AND conrelid = 'training_classes'::regclass
    ) THEN
        ALTER TABLE training_classes
            ADD CONSTRAINT training_classes_curriculum_fkey
            FOREIGN KEY (curriculum_id) REFERENCES curricula(curriculum_id) ON DELETE RESTRICT NOT VALID;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
         WHERE conname = 'training_classes_instructor_employee_fkey'
           AND conrelid = 'training_classes'::regclass
    ) THEN
        ALTER TABLE training_classes
            ADD CONSTRAINT training_classes_instructor_employee_fkey
            FOREIGN KEY (instructor_employee_id) REFERENCES employees(employee_id) ON DELETE SET NULL NOT VALID;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
         WHERE conname = 'training_classes_data_batch_fkey'
           AND conrelid = 'training_classes'::regclass
    ) THEN
        ALTER TABLE training_classes
            ADD CONSTRAINT training_classes_data_batch_fkey
            FOREIGN KEY (data_batch_id) REFERENCES data_batches(batch_id) ON DELETE SET NULL NOT VALID;
    END IF;
END $$;

UPDATE training_classes training
   SET region_id = (
           SELECT region.region_id
             FROM regions region
            WHERE BTRIM(region.region_name) = BTRIM(training.region_name)
               OR BTRIM(COALESCE(region.dashboard_group, '')) = BTRIM(training.region_name)
               OR BTRIM(region.region_code) = BTRIM(training.region_name)
            ORDER BY CASE WHEN BTRIM(region.region_name) = BTRIM(training.region_name) THEN 0 ELSE 1 END,
                     region.region_code
            LIMIT 1
       ),
       updated_at = NOW()
 WHERE training.region_id IS NULL
   AND EXISTS (
        SELECT 1
          FROM regions region
         WHERE BTRIM(region.region_name) = BTRIM(training.region_name)
            OR BTRIM(COALESCE(region.dashboard_group, '')) = BTRIM(training.region_name)
            OR BTRIM(region.region_code) = BTRIM(training.region_name)
       );

UPDATE training_classes training
   SET curriculum_id = curriculum.curriculum_id,
       updated_at = NOW()
  FROM curricula curriculum
 WHERE training.curriculum_id IS NULL
   AND curriculum.curriculum_code = 'LEGACY-PORTAL-LABS'
   AND curriculum.version = '1';

UPDATE training_classes training
   SET instructor_employee_id = employee.employee_id,
       updated_at = NOW()
  FROM employees employee
 WHERE training.instructor_employee_id IS NULL
   AND training.instructor_user_id = employee.user_id;

UPDATE training_classes training
   SET data_batch_id = batch.batch_id,
       updated_at = NOW()
  FROM data_batches batch
 WHERE training.data_batch_id IS NULL
   AND batch.batch_key = NULLIF(BTRIM(training.seed_batch), '');

CREATE INDEX IF NOT EXISTS idx_training_classes_region_curriculum_status
    ON training_classes (region_id, curriculum_id, status, start_date);
CREATE INDEX IF NOT EXISTS idx_training_classes_data_batch
    ON training_classes (data_batch_id)
    WHERE data_batch_id IS NOT NULL;

ALTER TABLE class_enrollments ADD COLUMN IF NOT EXISTS employee_id UUID;
ALTER TABLE class_enrollments ADD COLUMN IF NOT EXISTS data_batch_id UUID;
ALTER TABLE class_enrollments ALTER COLUMN user_id DROP NOT NULL;

UPDATE class_enrollments enrollment
   SET employee_id = employee.employee_id,
       updated_at = NOW()
  FROM employees employee
 WHERE enrollment.employee_id IS NULL
   AND enrollment.user_id = employee.user_id;

UPDATE class_enrollments enrollment
   SET data_batch_id = batch.batch_id,
       updated_at = NOW()
  FROM data_batches batch
 WHERE enrollment.data_batch_id IS NULL
   AND batch.batch_key = NULLIF(BTRIM(enrollment.seed_batch), '');

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
         WHERE conname = 'class_enrollments_employee_fkey'
           AND conrelid = 'class_enrollments'::regclass
    ) THEN
        ALTER TABLE class_enrollments
            ADD CONSTRAINT class_enrollments_employee_fkey
            FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE RESTRICT NOT VALID;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
         WHERE conname = 'class_enrollments_data_batch_fkey'
           AND conrelid = 'class_enrollments'::regclass
    ) THEN
        ALTER TABLE class_enrollments
            ADD CONSTRAINT class_enrollments_data_batch_fkey
            FOREIGN KEY (data_batch_id) REFERENCES data_batches(batch_id) ON DELETE SET NULL NOT VALID;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
         WHERE conname = 'class_enrollments_identity_check'
           AND conrelid = 'class_enrollments'::regclass
    ) THEN
        ALTER TABLE class_enrollments
            ADD CONSTRAINT class_enrollments_identity_check
            CHECK (employee_id IS NOT NULL OR user_id IS NOT NULL) NOT VALID;
    END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_class_enrollments_one_current_employee_class
    ON class_enrollments (employee_id)
    WHERE employee_id IS NOT NULL AND status = 'active' AND valid_to IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_class_enrollments_id_class
    ON class_enrollments (enrollment_id, class_id);
CREATE INDEX IF NOT EXISTS idx_class_enrollments_employee_dates
    ON class_enrollments (employee_id, valid_from DESC, valid_to, status)
    WHERE employee_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_class_enrollments_data_batch
    ON class_enrollments (data_batch_id)
    WHERE data_batch_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- Class work, individual assignments, attempts and events
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS class_lab_assignments (
    class_lab_assignment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL,
    curriculum_lab_id UUID NOT NULL,
    assigned_at TIMESTAMPTZ NOT NULL,
    due_at TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL DEFAULT 'assigned',
    assignment_source VARCHAR(30) NOT NULL DEFAULT 'curriculum',
    is_inferred BOOLEAN NOT NULL DEFAULT FALSE,
    data_batch_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT class_lab_assignments_class_fkey
        FOREIGN KEY (class_id) REFERENCES training_classes(class_id) ON DELETE RESTRICT,
    CONSTRAINT class_lab_assignments_curriculum_lab_fkey
        FOREIGN KEY (curriculum_lab_id) REFERENCES curriculum_labs(curriculum_lab_id) ON DELETE RESTRICT,
    CONSTRAINT class_lab_assignments_batch_fkey
        FOREIGN KEY (data_batch_id) REFERENCES data_batches(batch_id) ON DELETE SET NULL,
    CONSTRAINT class_lab_assignments_status_check
        CHECK (status IN ('assigned', 'active', 'closed', 'cancelled', 'waived')),
    CONSTRAINT class_lab_assignments_source_check
        CHECK (assignment_source IN ('curriculum', 'manual', 'import', 'legacy_observed', 'other')),
    CONSTRAINT class_lab_assignments_time_check
        CHECK (due_at IS NULL OR due_at >= assigned_at),
    CONSTRAINT class_lab_assignments_unique
        UNIQUE (class_id, curriculum_lab_id),
    CONSTRAINT class_lab_assignments_id_context_unique
        UNIQUE (class_lab_assignment_id, class_id, curriculum_lab_id)
);

CREATE INDEX IF NOT EXISTS idx_class_lab_assignments_class_status_due
    ON class_lab_assignments (class_id, status, due_at, assigned_at);
CREATE INDEX IF NOT EXISTS idx_class_lab_assignments_curriculum_lab
    ON class_lab_assignments (curriculum_lab_id, class_id);
CREATE INDEX IF NOT EXISTS idx_class_lab_assignments_batch
    ON class_lab_assignments (data_batch_id)
    WHERE data_batch_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS lab_assignments (
    assignment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id BIGINT NOT NULL,
    class_lab_assignment_id UUID,
    curriculum_lab_id UUID NOT NULL,
    assigned_at TIMESTAMPTZ NOT NULL,
    due_at TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL DEFAULT 'assigned',
    first_pass_attempt_no INTEGER,
    first_try_evidence VARCHAR(24) NOT NULL DEFAULT 'unknown',
    completed_at TIMESTAMPTZ,
    region_id_snapshot UUID,
    unit_id_snapshot UUID,
    class_id_snapshot UUID NOT NULL,
    assignment_source VARCHAR(30) NOT NULL DEFAULT 'explicit',
    is_inferred BOOLEAN NOT NULL DEFAULT FALSE,
    data_batch_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT lab_assignments_enrollment_fkey
        FOREIGN KEY (enrollment_id) REFERENCES class_enrollments(enrollment_id) ON DELETE RESTRICT,
    CONSTRAINT lab_assignments_enrollment_class_fkey
        FOREIGN KEY (enrollment_id, class_id_snapshot)
        REFERENCES class_enrollments(enrollment_id, class_id) ON DELETE RESTRICT,
    CONSTRAINT lab_assignments_class_lab_fkey
        FOREIGN KEY (class_lab_assignment_id) REFERENCES class_lab_assignments(class_lab_assignment_id) ON DELETE RESTRICT,
    CONSTRAINT lab_assignments_class_lab_context_fkey
        FOREIGN KEY (class_lab_assignment_id, class_id_snapshot, curriculum_lab_id)
        REFERENCES class_lab_assignments(class_lab_assignment_id, class_id, curriculum_lab_id) ON DELETE RESTRICT,
    CONSTRAINT lab_assignments_curriculum_lab_fkey
        FOREIGN KEY (curriculum_lab_id) REFERENCES curriculum_labs(curriculum_lab_id) ON DELETE RESTRICT,
    CONSTRAINT lab_assignments_region_fkey
        FOREIGN KEY (region_id_snapshot) REFERENCES regions(region_id) ON DELETE RESTRICT,
    CONSTRAINT lab_assignments_unit_fkey
        FOREIGN KEY (unit_id_snapshot) REFERENCES org_units(unit_id) ON DELETE RESTRICT,
    CONSTRAINT lab_assignments_class_fkey
        FOREIGN KEY (class_id_snapshot) REFERENCES training_classes(class_id) ON DELETE RESTRICT,
    CONSTRAINT lab_assignments_batch_fkey
        FOREIGN KEY (data_batch_id) REFERENCES data_batches(batch_id) ON DELETE SET NULL,
    CONSTRAINT lab_assignments_status_check
        CHECK (status IN ('assigned', 'in_progress', 'passed', 'expired', 'waived')),
    CONSTRAINT lab_assignments_first_pass_check
        CHECK (first_pass_attempt_no IS NULL OR first_pass_attempt_no >= 1),
    CONSTRAINT lab_assignments_first_try_evidence_check
        CHECK (first_try_evidence IN ('unknown', 'derived_complete', 'legacy_reported')),
    CONSTRAINT lab_assignments_source_check
        CHECK (assignment_source IN ('explicit', 'class_curriculum', 'manual', 'import', 'legacy_observed', 'other')),
    CONSTRAINT lab_assignments_time_check
        CHECK (due_at IS NULL OR due_at >= assigned_at),
    CONSTRAINT lab_assignments_completion_check
        CHECK (
            (status = 'passed' AND completed_at IS NOT NULL AND first_pass_attempt_no IS NOT NULL)
            OR
            (status <> 'passed' AND completed_at IS NULL AND first_pass_attempt_no IS NULL)
        ),
    CONSTRAINT lab_assignments_unique
        UNIQUE (enrollment_id, curriculum_lab_id)
);

CREATE INDEX IF NOT EXISTS idx_lab_assignments_class_lab_status
    ON lab_assignments (class_lab_assignment_id, status)
    WHERE class_lab_assignment_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_lab_assignments_status_due
    ON lab_assignments (status, due_at, assigned_at);
CREATE INDEX IF NOT EXISTS idx_lab_assignments_region_lab
    ON lab_assignments (region_id_snapshot, curriculum_lab_id, status);
CREATE INDEX IF NOT EXISTS idx_lab_assignments_unit_lab
    ON lab_assignments (unit_id_snapshot, curriculum_lab_id, status)
    WHERE unit_id_snapshot IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_lab_assignments_class_lab_snapshot
    ON lab_assignments (class_id_snapshot, curriculum_lab_id, status);
CREATE INDEX IF NOT EXISTS idx_lab_assignments_batch
    ON lab_assignments (data_batch_id)
    WHERE data_batch_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS lab_attempts (
    attempt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL,
    mode VARCHAR(20) NOT NULL,
    attempt_no INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
    outcome VARCHAR(20),
    started_at TIMESTAMPTZ NOT NULL,
    finished_at TIMESTAMPTZ,
    duration_seconds INTEGER,
    score NUMERIC(5, 2),
    error_count INTEGER NOT NULL DEFAULT 0,
    last_action TEXT,
    source_event_key VARCHAR(240) UNIQUE,
    source_timer_session_id BIGINT UNIQUE,
    sequence_complete BOOLEAN NOT NULL DEFAULT TRUE,
    data_batch_id UUID,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT lab_attempts_assignment_fkey
        FOREIGN KEY (assignment_id) REFERENCES lab_assignments(assignment_id) ON DELETE RESTRICT,
    CONSTRAINT lab_attempts_batch_fkey
        FOREIGN KEY (data_batch_id) REFERENCES data_batches(batch_id) ON DELETE SET NULL,
    CONSTRAINT lab_attempts_mode_check CHECK (mode IN ('practice', 'guide')),
    CONSTRAINT lab_attempts_number_check CHECK (attempt_no >= 1),
    CONSTRAINT lab_attempts_status_check
        CHECK (status IN ('in_progress', 'completed', 'failed', 'abandoned')),
    CONSTRAINT lab_attempts_outcome_check
        CHECK (outcome IS NULL OR outcome IN ('passed', 'failed')),
    CONSTRAINT lab_attempts_duration_check
        CHECK (duration_seconds IS NULL OR duration_seconds >= 0),
    CONSTRAINT lab_attempts_score_check
        CHECK (score IS NULL OR (score >= 0 AND score <= 100)),
    CONSTRAINT lab_attempts_error_count_check CHECK (error_count >= 0),
    CONSTRAINT lab_attempts_metadata_check CHECK (jsonb_typeof(metadata) = 'object'),
    CONSTRAINT lab_attempts_time_check
        CHECK (finished_at IS NULL OR finished_at >= started_at),
    CONSTRAINT lab_attempts_lifecycle_check
        CHECK (
            (status = 'in_progress' AND finished_at IS NULL AND outcome IS NULL)
            OR (status = 'completed' AND finished_at IS NOT NULL AND outcome = 'passed')
            OR (status = 'failed' AND finished_at IS NOT NULL AND outcome = 'failed')
            OR (status = 'abandoned' AND finished_at IS NOT NULL AND outcome IS NULL)
        ),
    CONSTRAINT lab_attempts_assignment_mode_number_unique
        UNIQUE (assignment_id, mode, attempt_no)
);

CREATE INDEX IF NOT EXISTS idx_lab_attempts_assignment_mode_started
    ON lab_attempts (assignment_id, mode, started_at, attempt_no);
CREATE INDEX IF NOT EXISTS idx_lab_attempts_status_started
    ON lab_attempts (status, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_lab_attempts_batch
    ON lab_attempts (data_batch_id)
    WHERE data_batch_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS lab_attempt_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_status VARCHAR(30),
    event_time TIMESTAMPTZ NOT NULL,
    sequence_no INTEGER,
    source_event_key VARCHAR(260) UNIQUE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    data_batch_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT lab_attempt_events_attempt_fkey
        FOREIGN KEY (attempt_id) REFERENCES lab_attempts(attempt_id) ON DELETE RESTRICT,
    CONSTRAINT lab_attempt_events_batch_fkey
        FOREIGN KEY (data_batch_id) REFERENCES data_batches(batch_id) ON DELETE SET NULL,
    CONSTRAINT lab_attempt_events_type_check CHECK (BTRIM(event_type) <> ''),
    CONSTRAINT lab_attempt_events_sequence_check CHECK (sequence_no IS NULL OR sequence_no >= 0),
    CONSTRAINT lab_attempt_events_metadata_check CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX IF NOT EXISTS idx_lab_attempt_events_attempt_time
    ON lab_attempt_events (attempt_id, event_time, sequence_no, event_id);
CREATE INDEX IF NOT EXISTS idx_lab_attempt_events_type_time
    ON lab_attempt_events (event_type, event_time DESC);
CREATE INDEX IF NOT EXISTS idx_lab_attempt_events_batch
    ON lab_attempt_events (data_batch_id)
    WHERE data_batch_id IS NOT NULL;

-- Infer a class-level assignment only for labs actually observed in that
-- class. This avoids fabricating a historical obligation for all 54 labs.
WITH resolved_sessions AS (
    SELECT timer.id,
           timer.user_id,
           timer.lab_id,
           timer.started_at,
           timer.finished_at,
           timer.created_at,
           timer.seed_batch,
           enrollment.enrollment_id,
           enrollment.class_id,
           training.curriculum_id,
           curriculum_lab.curriculum_lab_id,
           training.end_date,
           training.status AS class_status,
           training.data_batch_id AS class_batch_id
      FROM timer_sessions timer
      JOIN employees employee ON employee.user_id = timer.user_id
      JOIN LATERAL (
            SELECT candidate.enrollment_id, candidate.class_id, candidate.valid_from
              FROM class_enrollments candidate
             WHERE (candidate.employee_id = employee.employee_id OR candidate.user_id = timer.user_id)
               AND candidate.status <> 'withdrawn'
               AND candidate.valid_from <= COALESCE(timer.started_at, timer.finished_at, timer.created_at)::date
               AND (
                    candidate.valid_to IS NULL
                    OR candidate.valid_to >= COALESCE(timer.started_at, timer.finished_at, timer.created_at)::date
               )
             ORDER BY candidate.valid_from DESC, candidate.enrollment_id DESC
             LIMIT 1
           ) enrollment ON TRUE
      JOIN training_classes training ON training.class_id = enrollment.class_id
      JOIN curriculum_labs curriculum_lab
        ON curriculum_lab.curriculum_id = training.curriculum_id
       AND curriculum_lab.lab_id = timer.lab_id
       AND curriculum_lab.required_mode = 'practice'
     WHERE timer.user_id IS NOT NULL
       AND timer.lab_id IS NOT NULL
), class_lab_source AS (
    SELECT class_id,
           curriculum_lab_id,
           MIN(COALESCE(started_at, finished_at, created_at)) AS assigned_at,
           CASE
               WHEN end_date IS NULL THEN NULL
               ELSE (end_date::timestamp + INTERVAL '1 day' - INTERVAL '1 second') AT TIME ZONE 'Asia/Ho_Chi_Minh'
           END AS due_at,
           CASE class_status
               WHEN 'planned' THEN 'assigned'
               WHEN 'active' THEN 'active'
               ELSE 'closed'
           END AS assignment_status,
           (ARRAY_AGG(class_batch_id ORDER BY COALESCE(started_at, finished_at, created_at))
                FILTER (WHERE class_batch_id IS NOT NULL))[1] AS data_batch_id
      FROM resolved_sessions
     GROUP BY class_id, curriculum_lab_id, end_date, class_status
)
INSERT INTO class_lab_assignments (
    class_id,
    curriculum_lab_id,
    assigned_at,
    due_at,
    status,
    assignment_source,
    is_inferred,
    data_batch_id
)
SELECT class_id,
       curriculum_lab_id,
       assigned_at,
       CASE WHEN due_at IS NULL OR due_at >= assigned_at THEN due_at ELSE assigned_at END,
       assignment_status,
       'legacy_observed',
       TRUE,
       data_batch_id
  FROM class_lab_source
ON CONFLICT (class_id, curriculum_lab_id) DO UPDATE
SET assigned_at = LEAST(class_lab_assignments.assigned_at, EXCLUDED.assigned_at),
    due_at = COALESCE(class_lab_assignments.due_at, EXCLUDED.due_at),
    data_batch_id = COALESCE(class_lab_assignments.data_batch_id, EXCLUDED.data_batch_id),
    updated_at = NOW()
WHERE class_lab_assignments.is_inferred = TRUE;

WITH resolved_sessions AS (
    SELECT timer.*,
           employee.employee_id,
           enrollment.enrollment_id,
           enrollment.class_id,
           training.region_id AS class_region_id,
           training.curriculum_id,
           curriculum_lab.curriculum_lab_id,
           class_assignment.class_lab_assignment_id,
           class_assignment.due_at,
           batch.batch_id AS timer_batch_id,
           COALESCE(timer.started_at, timer.finished_at, timer.created_at) AS activity_at
      FROM timer_sessions timer
      JOIN employees employee ON employee.user_id = timer.user_id
      JOIN LATERAL (
            SELECT candidate.enrollment_id, candidate.class_id, candidate.valid_from
              FROM class_enrollments candidate
             WHERE (candidate.employee_id = employee.employee_id OR candidate.user_id = timer.user_id)
               AND candidate.status <> 'withdrawn'
               AND candidate.valid_from <= COALESCE(timer.started_at, timer.finished_at, timer.created_at)::date
               AND (
                    candidate.valid_to IS NULL
                    OR candidate.valid_to >= COALESCE(timer.started_at, timer.finished_at, timer.created_at)::date
               )
             ORDER BY candidate.valid_from DESC, candidate.enrollment_id DESC
             LIMIT 1
           ) enrollment ON TRUE
      JOIN training_classes training ON training.class_id = enrollment.class_id
      JOIN curriculum_labs curriculum_lab
        ON curriculum_lab.curriculum_id = training.curriculum_id
       AND curriculum_lab.lab_id = timer.lab_id
       AND curriculum_lab.required_mode = 'practice'
      JOIN class_lab_assignments class_assignment
        ON class_assignment.class_id = enrollment.class_id
       AND class_assignment.curriculum_lab_id = curriculum_lab.curriculum_lab_id
      LEFT JOIN data_batches batch
        ON batch.batch_key = NULLIF(BTRIM(timer.seed_batch), '')
     WHERE timer.user_id IS NOT NULL
       AND timer.lab_id IS NOT NULL
), grouped_sessions AS (
    SELECT enrollment_id,
           employee_id,
           class_id,
           class_region_id,
           curriculum_lab_id,
           class_lab_assignment_id,
           MIN(activity_at) AS assigned_at,
           MAX(due_at) AS due_at,
           MIN(COALESCE(finished_at, started_at, created_at))
               FILTER (WHERE mode = 'Thực hành' AND status = 'completed') AS completed_at,
           (ARRAY_AGG(completed_first_try ORDER BY activity_at, id)
                FILTER (WHERE mode = 'Thực hành' AND status = 'completed'))[1] AS first_pass_report,
           BOOL_OR(mode = 'Thực hành' AND status = 'completed') AS has_practice_pass,
           BOOL_OR(mode = 'Thực hành' AND status IN ('in_progress', 'failed', 'abandoned')) AS has_practice_activity,
           (ARRAY_AGG(timer_batch_id ORDER BY activity_at)
                FILTER (WHERE timer_batch_id IS NOT NULL))[1] AS data_batch_id
      FROM resolved_sessions
     GROUP BY enrollment_id,
              employee_id,
              class_id,
              class_region_id,
              curriculum_lab_id,
              class_lab_assignment_id
), snapshot_source AS (
    SELECT grouped.*,
           org.unit_id AS unit_id_snapshot,
           COALESCE(org_region.region_id, grouped.class_region_id) AS region_id_snapshot
      FROM grouped_sessions grouped
      LEFT JOIN LATERAL (
            SELECT assignment.unit_id
              FROM employee_org_assignments assignment
             WHERE assignment.employee_id = grouped.employee_id
               AND assignment.valid_from <= grouped.assigned_at::date
               AND (assignment.valid_to IS NULL OR assignment.valid_to >= grouped.assigned_at::date)
               AND assignment.status <> 'cancelled'
             ORDER BY assignment.valid_from DESC, assignment.created_at DESC
             LIMIT 1
           ) org ON TRUE
      LEFT JOIN org_units org_unit ON org_unit.unit_id = org.unit_id
      LEFT JOIN regions org_region ON org_region.region_id = org_unit.region_id
)
INSERT INTO lab_assignments (
    enrollment_id,
    class_lab_assignment_id,
    curriculum_lab_id,
    assigned_at,
    due_at,
    status,
    first_pass_attempt_no,
    first_try_evidence,
    completed_at,
    region_id_snapshot,
    unit_id_snapshot,
    class_id_snapshot,
    assignment_source,
    is_inferred,
    data_batch_id
)
SELECT enrollment_id,
       class_lab_assignment_id,
       curriculum_lab_id,
       assigned_at,
       CASE WHEN due_at IS NULL OR due_at >= assigned_at THEN due_at ELSE assigned_at END,
       CASE
           WHEN has_practice_pass AND first_pass_report IS NOT NULL THEN 'passed'
           WHEN has_practice_pass OR has_practice_activity THEN 'in_progress'
           ELSE 'assigned'
       END,
       CASE
           WHEN NOT has_practice_pass THEN NULL
           WHEN first_pass_report IS TRUE THEN 1
           WHEN first_pass_report IS FALSE THEN 2
           ELSE NULL
       END,
       CASE
           WHEN has_practice_pass AND first_pass_report IS NOT NULL THEN 'legacy_reported'
           ELSE 'unknown'
       END,
       CASE WHEN has_practice_pass AND first_pass_report IS NOT NULL THEN completed_at END,
       region_id_snapshot,
       unit_id_snapshot,
       class_id,
       'legacy_observed',
       TRUE,
       data_batch_id
  FROM snapshot_source
 -- A legacy completed row without first-try evidence cannot satisfy the table's
 -- passed lifecycle invariant. Keep it as in-progress until real attempt
 -- evidence is available instead of inventing a first-pass attempt number.
ON CONFLICT (enrollment_id, curriculum_lab_id) DO UPDATE
SET assigned_at = LEAST(lab_assignments.assigned_at, EXCLUDED.assigned_at),
    due_at = COALESCE(lab_assignments.due_at, EXCLUDED.due_at),
    status = EXCLUDED.status,
    first_pass_attempt_no = EXCLUDED.first_pass_attempt_no,
    first_try_evidence = EXCLUDED.first_try_evidence,
    completed_at = EXCLUDED.completed_at,
    region_id_snapshot = COALESCE(lab_assignments.region_id_snapshot, EXCLUDED.region_id_snapshot),
    unit_id_snapshot = COALESCE(lab_assignments.unit_id_snapshot, EXCLUDED.unit_id_snapshot),
    data_batch_id = COALESCE(lab_assignments.data_batch_id, EXCLUDED.data_batch_id),
    updated_at = NOW()
WHERE lab_assignments.is_inferred = TRUE;

-- Backfill each resolvable timer row as one attempt. A history whose first
-- visible row is already completed is never considered sequence-complete.
-- When it explicitly reports first_try = FALSE, numbering also starts at 2 to
-- preserve the missing prior-attempt fact.
WITH resolved_timer_attempts AS (
    SELECT timer.*,
           assignment.assignment_id,
           CASE timer.mode WHEN 'Hướng dẫn' THEN 'guide' ELSE 'practice' END AS normalized_mode,
           batch.batch_id AS data_batch_id,
           COALESCE(timer.started_at, timer.created_at) AS normalized_started_at,
           CASE
               WHEN timer.status = 'in_progress' THEN NULL
               ELSE GREATEST(
                   COALESCE(timer.finished_at, timer.started_at, timer.created_at),
                   COALESCE(timer.started_at, timer.created_at)
               )
           END AS normalized_finished_at,
           CASE timer.status
               WHEN 'completed' THEN 'completed'
               WHEN 'failed' THEN 'failed'
               WHEN 'abandoned' THEN 'abandoned'
               ELSE 'in_progress'
           END AS normalized_status
      FROM timer_sessions timer
      JOIN employees employee ON employee.user_id = timer.user_id
      JOIN LATERAL (
            SELECT candidate.enrollment_id, candidate.class_id
              FROM class_enrollments candidate
             WHERE (candidate.employee_id = employee.employee_id OR candidate.user_id = timer.user_id)
               AND candidate.status <> 'withdrawn'
               AND candidate.valid_from <= COALESCE(timer.started_at, timer.finished_at, timer.created_at)::date
               AND (
                    candidate.valid_to IS NULL
                    OR candidate.valid_to >= COALESCE(timer.started_at, timer.finished_at, timer.created_at)::date
               )
             ORDER BY candidate.valid_from DESC, candidate.enrollment_id DESC
             LIMIT 1
           ) enrollment ON TRUE
      JOIN training_classes training ON training.class_id = enrollment.class_id
      JOIN curriculum_labs curriculum_lab
        ON curriculum_lab.curriculum_id = training.curriculum_id
       AND curriculum_lab.lab_id = timer.lab_id
       AND curriculum_lab.required_mode = 'practice'
      JOIN lab_assignments assignment
        ON assignment.enrollment_id = enrollment.enrollment_id
       AND assignment.curriculum_lab_id = curriculum_lab.curriculum_lab_id
      LEFT JOIN data_batches batch
        ON batch.batch_key = NULLIF(BTRIM(timer.seed_batch), '')
     WHERE timer.status <> 'not_started'
       AND timer.mode IN ('Thực hành', 'Hướng dẫn')
       AND NOT EXISTS (
            SELECT 1
              FROM lab_attempts existing_attempt
             WHERE existing_attempt.source_timer_session_id = timer.id
                OR existing_attempt.source_event_key = 'timer_session:' || timer.id::text
       )
), numbered_candidates AS (
    SELECT candidate.*,
           COALESCE(existing.maximum_attempt_no, 0) AS existing_maximum_attempt_no,
           ROW_NUMBER() OVER (
               PARTITION BY candidate.assignment_id, candidate.normalized_mode
               ORDER BY candidate.normalized_started_at, candidate.id
           ) AS candidate_row_number,
           FIRST_VALUE(candidate.normalized_status) OVER (
               PARTITION BY candidate.assignment_id, candidate.normalized_mode
               ORDER BY candidate.normalized_started_at, candidate.id
           ) AS first_candidate_status,
           FIRST_VALUE(candidate.completed_first_try) OVER (
               PARTITION BY candidate.assignment_id, candidate.normalized_mode
               ORDER BY candidate.normalized_started_at, candidate.id
           ) AS first_candidate_first_try
      FROM resolved_timer_attempts candidate
      LEFT JOIN LATERAL (
            SELECT MAX(attempt.attempt_no) AS maximum_attempt_no
              FROM lab_attempts attempt
             WHERE attempt.assignment_id = candidate.assignment_id
               AND attempt.mode = candidate.normalized_mode
           ) existing ON TRUE
), prepared_attempts AS (
    SELECT numbered.*,
           numbered.existing_maximum_attempt_no
           + numbered.candidate_row_number
           + CASE
                 WHEN numbered.existing_maximum_attempt_no = 0
                  AND numbered.normalized_mode = 'practice'
                  AND numbered.first_candidate_status = 'completed'
                  AND numbered.first_candidate_first_try IS FALSE
                 THEN 1
                 ELSE 0
             END AS normalized_attempt_no,
           NOT (
               numbered.existing_maximum_attempt_no = 0
               AND numbered.normalized_mode = 'practice'
               AND numbered.first_candidate_status = 'completed'
           ) AS normalized_sequence_complete
      FROM numbered_candidates numbered
)
INSERT INTO lab_attempts (
    assignment_id,
    mode,
    attempt_no,
    status,
    outcome,
    started_at,
    finished_at,
    duration_seconds,
    error_count,
    last_action,
    source_event_key,
    source_timer_session_id,
    sequence_complete,
    data_batch_id,
    metadata,
    created_at,
    updated_at
)
SELECT assignment_id,
       normalized_mode,
       normalized_attempt_no,
       normalized_status,
       CASE normalized_status
           WHEN 'completed' THEN 'passed'
           WHEN 'failed' THEN 'failed'
           ELSE NULL
       END,
       normalized_started_at,
       normalized_finished_at,
       CASE WHEN duration_sec IS NULL THEN NULL ELSE GREATEST(duration_sec, 0) END,
       CASE WHEN normalized_status = 'failed' THEN 1 ELSE 0 END,
       last_action,
       'timer_session:' || id::text,
       id,
       normalized_sequence_complete,
       data_batch_id,
       jsonb_strip_nulls(jsonb_build_object(
           'legacy_completed_first_try', completed_first_try,
           'legacy_seed_key', seed_key,
           'legacy_device', device,
           'legacy_lab_name', lab_name,
           'migration', '014_normalized_training_model'
       )),
       created_at,
       created_at
  FROM prepared_attempts
ON CONFLICT (source_timer_session_id) DO UPDATE
SET last_action = EXCLUDED.last_action,
    metadata = lab_attempts.metadata || EXCLUDED.metadata,
    data_batch_id = COALESCE(lab_attempts.data_batch_id, EXCLUDED.data_batch_id),
    updated_at = NOW();

-- Reconcile inferred assignment state from normalized practice attempts. A
-- pass with unknown first-try evidence stays in_progress rather than creating
-- a false KPI assertion; the attempt itself remains available for audit.
WITH practice_evidence AS (
    SELECT assignment.assignment_id,
           MIN(attempt.attempt_no) FILTER (WHERE attempt.outcome = 'passed') AS first_pass_attempt_no,
           MIN(attempt.finished_at) FILTER (WHERE attempt.outcome = 'passed') AS completed_at,
           BOOL_OR(attempt.status = 'in_progress') AS has_in_progress,
           BOOL_OR(attempt.status IN ('failed', 'abandoned')) AS has_terminal_non_pass,
           BOOL_OR(attempt.outcome = 'passed') AS has_pass,
           BOOL_AND(attempt.sequence_complete) AS sequence_complete
      FROM lab_assignments assignment
      LEFT JOIN lab_attempts attempt
        ON attempt.assignment_id = assignment.assignment_id
       AND attempt.mode = 'practice'
     WHERE assignment.is_inferred = TRUE
     GROUP BY assignment.assignment_id
)
UPDATE lab_assignments assignment
   SET first_pass_attempt_no = CASE
           WHEN evidence.first_pass_attempt_no IS NULL THEN NULL
           WHEN assignment.first_try_evidence = 'legacy_reported' THEN assignment.first_pass_attempt_no
           WHEN evidence.sequence_complete THEN evidence.first_pass_attempt_no
           ELSE NULL
       END,
       first_try_evidence = CASE
           WHEN assignment.first_try_evidence = 'legacy_reported' THEN 'legacy_reported'
           WHEN evidence.first_pass_attempt_no IS NOT NULL AND evidence.sequence_complete THEN 'derived_complete'
           ELSE 'unknown'
       END,
       status = CASE
           WHEN evidence.first_pass_attempt_no IS NOT NULL
            AND (assignment.first_try_evidence = 'legacy_reported' OR evidence.sequence_complete)
           THEN 'passed'
           WHEN evidence.has_pass OR evidence.has_in_progress OR evidence.has_terminal_non_pass THEN 'in_progress'
           ELSE 'assigned'
       END,
       completed_at = CASE
           WHEN evidence.first_pass_attempt_no IS NOT NULL
            AND (assignment.first_try_evidence = 'legacy_reported' OR evidence.sequence_complete)
           THEN evidence.completed_at
           ELSE NULL
       END,
       updated_at = NOW()
  FROM practice_evidence evidence
 WHERE assignment.assignment_id = evidence.assignment_id;

INSERT INTO lab_attempt_events (
    attempt_id,
    event_type,
    event_status,
    event_time,
    sequence_no,
    source_event_key,
    metadata,
    data_batch_id,
    created_at
)
SELECT attempt.attempt_id,
       'legacy.timer_session.summary',
       attempt.status,
       COALESCE(attempt.finished_at, attempt.started_at),
       0,
       attempt.source_event_key || ':summary',
       jsonb_build_object(
           'source_timer_session_id', attempt.source_timer_session_id,
           'migration', '014_normalized_training_model'
       ),
       attempt.data_batch_id,
       attempt.created_at
  FROM lab_attempts attempt
 WHERE attempt.source_timer_session_id IS NOT NULL
ON CONFLICT (source_event_key) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Row-level lineage reconstructed from normalized legacy records
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS data_batch_rows (
    data_batch_row_id BIGSERIAL PRIMARY KEY,
    batch_id UUID NOT NULL,
    source_row_number INTEGER,
    source_key VARCHAR(240),
    raw_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    validation_errors JSONB NOT NULL DEFAULT '[]'::jsonb,
    processing_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    target_table VARCHAR(80),
    target_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT data_batch_rows_batch_fkey
        FOREIGN KEY (batch_id) REFERENCES data_batches(batch_id) ON DELETE RESTRICT,
    CONSTRAINT data_batch_rows_source_row_check
        CHECK (source_row_number IS NULL OR source_row_number >= 1),
    CONSTRAINT data_batch_rows_status_check
        CHECK (processing_status IN ('pending', 'valid', 'invalid', 'imported', 'skipped', 'rolled_back')),
    CONSTRAINT data_batch_rows_raw_data_check CHECK (jsonb_typeof(raw_data) = 'object'),
    CONSTRAINT data_batch_rows_errors_check CHECK (jsonb_typeof(validation_errors) = 'array')
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_data_batch_rows_source_row
    ON data_batch_rows (batch_id, source_row_number)
    WHERE source_row_number IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_data_batch_rows_target_source
    ON data_batch_rows (batch_id, target_table, source_key)
    WHERE target_table IS NOT NULL AND source_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_data_batch_rows_batch_status
    ON data_batch_rows (batch_id, processing_status, data_batch_row_id);
CREATE INDEX IF NOT EXISTS idx_data_batch_rows_target
    ON data_batch_rows (target_table, target_id)
    WHERE target_table IS NOT NULL AND target_id IS NOT NULL;

INSERT INTO data_batch_rows (
    batch_id,
    source_key,
    raw_data,
    validation_errors,
    processing_status,
    target_table,
    target_id
)
SELECT employee.source_data_batch_id,
       'employee:' || employee.employee_code,
       jsonb_strip_nulls(jsonb_build_object(
           'employee_code', employee.employee_code,
           'full_name', employee.full_name,
           'email', employee.email,
           'source_system', employee.source_system,
           'lineage_kind', 'normalized_backfill'
       )),
       '[]'::jsonb,
       'imported',
       'employees',
       employee.employee_id::text
  FROM employees employee
 WHERE employee.source_data_batch_id IS NOT NULL
ON CONFLICT (batch_id, target_table, source_key)
WHERE target_table IS NOT NULL AND source_key IS NOT NULL
DO NOTHING;

INSERT INTO data_batch_rows (
    batch_id,
    source_key,
    raw_data,
    validation_errors,
    processing_status,
    target_table,
    target_id
)
SELECT training.data_batch_id,
       'class:' || training.class_code,
       jsonb_build_object(
           'class_code', training.class_code,
           'class_name', training.class_name,
           'region_name', training.region_name,
           'lineage_kind', 'normalized_backfill'
       ),
       '[]'::jsonb,
       'imported',
       'training_classes',
       training.class_id::text
  FROM training_classes training
 WHERE training.data_batch_id IS NOT NULL
ON CONFLICT (batch_id, target_table, source_key)
WHERE target_table IS NOT NULL AND source_key IS NOT NULL
DO NOTHING;

INSERT INTO data_batch_rows (
    batch_id,
    source_key,
    raw_data,
    validation_errors,
    processing_status,
    target_table,
    target_id
)
SELECT enrollment.data_batch_id,
       'enrollment:' || enrollment.enrollment_id::text,
       jsonb_strip_nulls(jsonb_build_object(
           'source_class_code', enrollment.source_class_code,
           'valid_from', enrollment.valid_from,
           'valid_to', enrollment.valid_to,
           'lineage_kind', 'normalized_backfill'
       )),
       '[]'::jsonb,
       'imported',
       'class_enrollments',
       enrollment.enrollment_id::text
  FROM class_enrollments enrollment
 WHERE enrollment.data_batch_id IS NOT NULL
ON CONFLICT (batch_id, target_table, source_key)
WHERE target_table IS NOT NULL AND source_key IS NOT NULL
DO NOTHING;

INSERT INTO data_batch_rows (
    batch_id,
    source_key,
    raw_data,
    validation_errors,
    processing_status,
    target_table,
    target_id
)
SELECT attempt.data_batch_id,
       attempt.source_event_key,
       jsonb_build_object(
           'source_timer_session_id', attempt.source_timer_session_id,
           'mode', attempt.mode,
           'status', attempt.status,
           'lineage_kind', 'normalized_backfill'
       ),
       '[]'::jsonb,
       'imported',
       'lab_attempts',
       attempt.attempt_id::text
  FROM lab_attempts attempt
 WHERE attempt.data_batch_id IS NOT NULL
   AND attempt.source_event_key IS NOT NULL
ON CONFLICT (batch_id, target_table, source_key)
WHERE target_table IS NOT NULL AND source_key IS NOT NULL
DO NOTHING;

WITH batch_totals AS (
    SELECT batch_id,
           COUNT(*)::integer AS row_count,
           COUNT(*) FILTER (WHERE processing_status = 'imported')::integer AS accepted_count,
           COUNT(*) FILTER (WHERE processing_status = 'invalid')::integer AS rejected_count
      FROM data_batch_rows
     GROUP BY batch_id
)
UPDATE data_batches batch
   SET row_count = totals.row_count,
       accepted_count = totals.accepted_count,
       rejected_count = totals.rejected_count,
       updated_at = NOW()
  FROM batch_totals totals
 WHERE batch.batch_id = totals.batch_id;

-- ---------------------------------------------------------------------------
-- KPI views. Assignment counts are the denominator; attempts never are.
-- Guide attempts are retained for audit but excluded from practice outcomes.
-- NULL first_try_success means the pass has insufficient attempt evidence.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE VIEW v_lab_assignment_progress AS
WITH practice_attempts AS (
    SELECT attempt.assignment_id,
           COUNT(*) AS practice_attempt_count,
           MIN(attempt.attempt_no) FILTER (WHERE attempt.outcome = 'passed') AS derived_first_pass_attempt_no,
           BOOL_AND(attempt.sequence_complete) AS sequence_complete,
           COUNT(*) FILTER (WHERE attempt.status = 'failed') AS failed_attempt_count,
           COUNT(*) FILTER (WHERE attempt.status = 'abandoned') AS abandoned_attempt_count,
           COUNT(*) FILTER (WHERE attempt.status = 'in_progress') AS in_progress_attempt_count,
           MIN(attempt.finished_at) FILTER (WHERE attempt.outcome = 'passed') AS derived_completed_at
      FROM lab_attempts attempt
     WHERE attempt.mode = 'practice'
     GROUP BY attempt.assignment_id
)
SELECT assignment.assignment_id,
       enrollment.enrollment_id,
       employee.employee_id,
       employee.employee_code,
       employee.full_name,
       assignment.class_id_snapshot AS class_id,
       training.class_code,
       training.class_name,
       curriculum.curriculum_id,
       curriculum.curriculum_code,
       curriculum.version AS curriculum_version,
       curriculum_lab.curriculum_lab_id,
       lab.lab_id,
       lab.lab_name,
       device.device_id,
       device.device_name,
       assignment.region_id_snapshot AS region_id,
       region.region_code,
       region.region_name,
       region.dashboard_group,
       assignment.unit_id_snapshot AS unit_id,
       unit.unit_code,
       unit.unit_name,
       assignment.assigned_at,
       assignment.due_at,
       assignment.status AS assignment_status,
       assignment.completed_at,
       assignment.first_pass_attempt_no,
       assignment.first_try_evidence,
       CASE
           WHEN assignment.status <> 'passed' THEN NULL
           WHEN attempt.sequence_complete IS TRUE
            AND attempt.derived_first_pass_attempt_no IS NOT NULL
           THEN attempt.derived_first_pass_attempt_no = 1
           ELSE NULL
       END AS first_try_success,
       CASE
           WHEN assignment.status = 'passed'
            AND assignment.first_try_evidence = 'legacy_reported'
            AND assignment.first_pass_attempt_no IS NOT NULL
           THEN assignment.first_pass_attempt_no = 1
           ELSE NULL
       END AS legacy_reported_first_try_success,
       COALESCE(attempt.practice_attempt_count, 0) AS practice_attempt_count,
       COALESCE(attempt.failed_attempt_count, 0) AS failed_attempt_count,
       COALESCE(attempt.abandoned_attempt_count, 0) AS abandoned_attempt_count,
       COALESCE(attempt.in_progress_attempt_count, 0) AS in_progress_attempt_count,
       attempt.sequence_complete AS attempt_sequence_complete,
       assignment.assignment_source,
       assignment.is_inferred,
       assignment.data_batch_id
  FROM lab_assignments assignment
  JOIN class_enrollments enrollment ON enrollment.enrollment_id = assignment.enrollment_id
  LEFT JOIN employees employee ON employee.employee_id = enrollment.employee_id
  JOIN training_classes training ON training.class_id = assignment.class_id_snapshot
  JOIN curriculum_labs curriculum_lab ON curriculum_lab.curriculum_lab_id = assignment.curriculum_lab_id
  JOIN curricula curriculum ON curriculum.curriculum_id = curriculum_lab.curriculum_id
  JOIN lab_catalog lab ON lab.lab_id = curriculum_lab.lab_id
  JOIN device_catalog device ON device.device_id = lab.device_id
  LEFT JOIN regions region ON region.region_id = assignment.region_id_snapshot
  LEFT JOIN org_units unit ON unit.unit_id = assignment.unit_id_snapshot
  LEFT JOIN practice_attempts attempt ON attempt.assignment_id = assignment.assignment_id;

CREATE OR REPLACE VIEW v_kpi_training_monthly AS
SELECT DATE_TRUNC('month', progress.assigned_at)::date AS period_month,
       progress.region_id,
       progress.region_code,
       progress.region_name,
       progress.class_id,
       progress.class_code,
       progress.curriculum_id,
       progress.curriculum_code,
       progress.curriculum_version,
       COUNT(*) FILTER (WHERE progress.assignment_status <> 'waived') AS assigned_count,
       COUNT(*) FILTER (
           WHERE progress.assignment_status <> 'waived'
             AND progress.due_at IS NOT NULL
             AND progress.due_at <= NOW()
       ) AS due_count,
       COUNT(*) FILTER (WHERE progress.assignment_status = 'passed') AS passed_count,
       COUNT(*) FILTER (
           WHERE progress.assignment_status = 'passed'
             AND progress.due_at IS NOT NULL
             AND progress.due_at <= NOW()
       ) AS passed_due_count,
       ROUND(
           100.0 * COUNT(*) FILTER (WHERE progress.assignment_status = 'passed')
           / NULLIF(COUNT(*) FILTER (WHERE progress.assignment_status <> 'waived'), 0),
           2
       ) AS completion_rate_assigned,
       ROUND(
           100.0 * COUNT(*) FILTER (
               WHERE progress.assignment_status = 'passed'
                 AND progress.due_at IS NOT NULL
                 AND progress.due_at <= NOW()
           )
           / NULLIF(COUNT(*) FILTER (
               WHERE progress.assignment_status <> 'waived'
                 AND progress.due_at IS NOT NULL
                 AND progress.due_at <= NOW()
           ), 0),
           2
       ) AS completion_rate_due,
       COUNT(*) FILTER (
           WHERE progress.assignment_status = 'passed'
             AND progress.first_try_success IS NOT NULL
       ) AS first_try_evaluable_count,
       COUNT(*) FILTER (WHERE progress.first_try_success IS TRUE) AS first_try_pass_count,
       ROUND(
           100.0 * COUNT(*) FILTER (WHERE progress.first_try_success IS TRUE)
           / NULLIF(COUNT(*) FILTER (
               WHERE progress.assignment_status = 'passed'
                 AND progress.first_try_success IS NOT NULL
           ), 0),
           2
       ) AS first_try_rate,
       COUNT(*) FILTER (WHERE progress.is_inferred) AS inferred_assignment_count
  FROM v_lab_assignment_progress progress
 GROUP BY DATE_TRUNC('month', progress.assigned_at)::date,
          progress.region_id,
          progress.region_code,
          progress.region_name,
          progress.class_id,
          progress.class_code,
          progress.curriculum_id,
          progress.curriculum_code,
          progress.curriculum_version;

CREATE OR REPLACE VIEW v_kpi_region_lab AS
SELECT progress.region_id,
       progress.region_code,
       progress.region_name,
       progress.dashboard_group,
       progress.curriculum_id,
       progress.curriculum_code,
       progress.curriculum_version,
       progress.device_id,
       progress.device_name,
       progress.lab_id,
       progress.lab_name,
       COUNT(DISTINCT progress.employee_id)
           FILTER (WHERE progress.assignment_status <> 'waived') AS assigned_technician_count,
       COUNT(DISTINCT progress.employee_id)
           FILTER (WHERE progress.assignment_status = 'passed') AS passed_technician_count,
       ROUND(
           100.0 * COUNT(DISTINCT progress.employee_id)
               FILTER (WHERE progress.assignment_status = 'passed')
           / NULLIF(
               COUNT(DISTINCT progress.employee_id)
                   FILTER (WHERE progress.assignment_status <> 'waived'),
               0
           ),
           2
       ) AS completion_rate,
       COUNT(DISTINCT progress.employee_id)
           FILTER (
               WHERE progress.assignment_status = 'passed'
                 AND progress.first_try_success IS NOT NULL
           ) AS first_try_evaluable_technician_count,
       COUNT(DISTINCT progress.employee_id)
           FILTER (WHERE progress.first_try_success IS TRUE) AS first_try_pass_technician_count,
       ROUND(
           100.0 * COUNT(DISTINCT progress.employee_id)
               FILTER (WHERE progress.first_try_success IS TRUE)
           / NULLIF(
               COUNT(DISTINCT progress.employee_id)
                   FILTER (
                       WHERE progress.assignment_status = 'passed'
                         AND progress.first_try_success IS NOT NULL
                   ),
               0
           ),
           2
       ) AS first_try_rate,
       COUNT(*) FILTER (WHERE progress.is_inferred) AS inferred_assignment_count
  FROM v_lab_assignment_progress progress
 GROUP BY progress.region_id,
          progress.region_code,
          progress.region_name,
          progress.dashboard_group,
          progress.curriculum_id,
          progress.curriculum_code,
          progress.curriculum_version,
          progress.device_id,
          progress.device_name,
          progress.lab_id,
          progress.lab_name;

COMMENT ON TABLE employees IS
    'Canonical employee profile. users remains the IAM account table during the compatibility period.';
COMMENT ON TABLE employee_org_assignments IS
    'Effective-dated organization history; inferred legacy rows are explicitly marked.';
COMMENT ON TABLE lab_assignments IS
    'Business denominator for completion KPIs. Do not use lab_attempt count as the denominator.';
COMMENT ON COLUMN lab_assignments.is_inferred IS
    'TRUE means reconstructed from observed legacy activity, not proof of an official assignment.';
COMMENT ON COLUMN lab_assignments.first_try_evidence IS
    'unknown, derived from complete normalized history, or preserved from a nullable legacy report.';
COMMENT ON VIEW v_kpi_region_lab IS
    'Region/lab KPI: distinct passed employees divided by distinct assigned employees; absent rows mean not assigned/N/A.';
