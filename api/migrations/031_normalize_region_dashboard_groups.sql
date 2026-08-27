-- 031: Store the matrix parent/child relationship in the database.
-- Leaf regions keep their self group for compatibility; shared regions use the
-- stable parent code so the dashboard can build dropdown rows without hard-code.

UPDATE regions
   SET dashboard_group = CASE
           WHEN region_name IN ('TDDT - PNC', 'TDDT - TIN') THEN 'TDDT'
           WHEN region_name IN ('TNMT - PNC', 'TNMT - TIN') THEN 'TNMT'
           ELSE dashboard_group
       END,
       updated_at = NOW()
 WHERE (region_name IN ('TDDT - PNC', 'TDDT - TIN') AND dashboard_group IS DISTINCT FROM 'TDDT')
    OR (region_name IN ('TNMT - PNC', 'TNMT - TIN') AND dashboard_group IS DISTINCT FROM 'TNMT');
