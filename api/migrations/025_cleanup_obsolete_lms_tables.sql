-- 025_cleanup_obsolete_lms_tables.sql
-- Streamline database schema: drop obsolete LMS multi-tier tables and views.
-- Final state: 9 FTC core tables (users, timer_sessions, device_catalog,
-- lab_catalog, regions, app_sessions, login_logs, roster_import_log,
-- schema_migrations) + Django admin tables.

-- 1. Drop views that reference LMS tables
DROP VIEW IF EXISTS v_lab_assignment_progress;
DROP VIEW IF EXISTS v_current_training_class;

-- 2. Drop attempt & assignment tables
DROP TABLE IF EXISTS lab_attempts;
DROP TABLE IF EXISTS lab_assignments;

-- 3. Drop enrollment & class tables
DROP TABLE IF EXISTS class_enrollments;
DROP TABLE IF EXISTS training_classes;

-- 4. Drop curriculum & grading tables
DROP TABLE IF EXISTS curriculum_labs;
DROP TABLE IF EXISTS curricula;
DROP TABLE IF EXISTS lab_grading_criteria;
