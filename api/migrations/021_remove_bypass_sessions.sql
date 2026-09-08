-- Migration 021: Remove dev-bypass sessions from timer_sessions
-- Bypass sessions are identified by:
--   technician_id = 'ANONYMOUS' (frontend fallback)
--   email = '' or 'dev-bypass@ftc.local'
--   user_id IS NULL (bypass user not stored in DB)

DELETE FROM timer_sessions
WHERE user_id IS NULL
  AND (
    technician_id = 'ANONYMOUS'
    OR technician_id = ''
    OR email = ''
    OR email = 'dev-bypass@ftc.local'
  );
