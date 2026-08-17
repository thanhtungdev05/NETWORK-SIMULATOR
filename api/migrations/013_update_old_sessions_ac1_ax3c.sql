-- Update existing timer_sessions records from old frontend IDs to the new catalog IDs

-- For AC1000F
UPDATE timer_sessions SET lab_id = 'LAB_AC1000F_01' WHERE lab_id = 'ac1-bai1';
UPDATE timer_sessions SET lab_id = 'LAB_AC1000F_02' WHERE lab_id = 'ac1-bai2';
UPDATE timer_sessions SET lab_id = 'LAB_AC1000F_03' WHERE lab_id = 'ac1-bai3';
UPDATE timer_sessions SET lab_id = 'LAB_AC1000F_04' WHERE lab_id = 'ac1-bai4';
UPDATE timer_sessions SET lab_id = 'LAB_AC1000F_05' WHERE lab_id = 'ac1-bai5';
UPDATE timer_sessions SET lab_id = 'LAB_AC1000F_06' WHERE lab_id = 'ac1-bai6';
UPDATE timer_sessions SET lab_id = 'LAB_AC1000F_07' WHERE lab_id = 'ac1-bai7';
UPDATE timer_sessions SET lab_id = 'LAB_AC1000F_08' WHERE lab_id = 'ac1-bai8';
UPDATE timer_sessions SET lab_id = 'LAB_AC1000F_09' WHERE lab_id = 'ac1-bai9';
UPDATE timer_sessions SET lab_id = 'LAB_AC1000F_10' WHERE lab_id = 'ac1-bai10';

-- For AX3000C
UPDATE timer_sessions SET lab_id = 'LAB_AX3000CV2_01' WHERE lab_id = 'ax3c-bai1';
UPDATE timer_sessions SET lab_id = 'LAB_AX3000CV2_02' WHERE lab_id = 'ax3c-bai2';
UPDATE timer_sessions SET lab_id = 'LAB_AX3000CV2_03' WHERE lab_id = 'ax3c-bai3';
UPDATE timer_sessions SET lab_id = 'LAB_AX3000CV2_04' WHERE lab_id = 'ax3c-bai4';
UPDATE timer_sessions SET lab_id = 'LAB_AX3000CV2_05' WHERE lab_id = 'ax3c-bai5';
UPDATE timer_sessions SET lab_id = 'LAB_AX3000CV2_06' WHERE lab_id = 'ax3c-bai6';
UPDATE timer_sessions SET lab_id = 'LAB_AX3000CV2_07' WHERE lab_id = 'ax3c-bai7';
UPDATE timer_sessions SET lab_id = 'LAB_AX3000CV2_08' WHERE lab_id = 'ax3c-bai8';
UPDATE timer_sessions SET lab_id = 'LAB_AX3000CV2_09' WHERE lab_id = 'ax3c-bai9';
UPDATE timer_sessions SET lab_id = 'LAB_AX3000CV2_10' WHERE lab_id = 'ax3c-bai10';
