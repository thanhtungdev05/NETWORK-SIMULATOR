-- 025_cleanup_obsolete_lms_tables.sql
-- Streamline database schema: drop obsolete LMS multi-tier tables and views.

-- 1. Drop obsolete views
DROP VIEW IF EXISTS v_lab_assignment_progress;
DROP VIEW IF EXISTS v_current_training_class;

-- 2. Drop obsolete attempt & assignment tables
DROP TABLE IF EXISTS lab_attempts;
DROP TABLE IF EXISTS lab_assignments;

-- 3. Drop obsolete enrollment & class tables
DROP TABLE IF EXISTS class_enrollments;
DROP TABLE IF EXISTS training_classes;

-- 4. Drop obsolete curriculum & grading tables
DROP TABLE IF EXISTS curriculum_labs;
DROP TABLE IF EXISTS curricula;
DROP TABLE IF EXISTS lab_grading_criteria;
