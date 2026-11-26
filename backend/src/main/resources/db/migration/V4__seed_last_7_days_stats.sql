-- Seed light historical activity so the dashboard 7-day chart has real points
-- (idempotent-ish: only inserts when that day has no appointments yet)

INSERT INTO appointments (patient_id, appointment_time, duration_minutes, status, notes, created_at, updated_at)
SELECT 1, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 6 DAY), INTERVAL 10 HOUR), 30, 'COMPLETED', 'สถิติย้อนหลัง', NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM appointments a
  WHERE DATE(a.appointment_time) = DATE_SUB(CURDATE(), INTERVAL 6 DAY)
);

INSERT INTO appointments (patient_id, appointment_time, duration_minutes, status, notes, created_at, updated_at)
SELECT 2, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL 11 HOUR), 30, 'COMPLETED', 'สถิติย้อนหลัง', NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM appointments a
  WHERE DATE(a.appointment_time) = DATE_SUB(CURDATE(), INTERVAL 5 DAY)
);

INSERT INTO appointments (patient_id, appointment_time, duration_minutes, status, notes, created_at, updated_at)
SELECT 3, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL 9 HOUR), 30, 'COMPLETED', 'สถิติย้อนหลัง', NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM appointments a
  WHERE DATE(a.appointment_time) = DATE_SUB(CURDATE(), INTERVAL 4 DAY)
);

INSERT INTO appointments (patient_id, appointment_time, duration_minutes, status, notes, created_at, updated_at)
SELECT 4, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL 14 HOUR), 30, 'SCHEDULED', 'สถิติย้อนหลัง', NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM appointments a
  WHERE DATE(a.appointment_time) = DATE_SUB(CURDATE(), INTERVAL 3 DAY)
);

INSERT INTO appointments (patient_id, appointment_time, duration_minutes, status, notes, created_at, updated_at)
SELECT 5, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL 10 HOUR), 30, 'COMPLETED', 'สถิติย้อนหลัง', NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM appointments a
  WHERE DATE(a.appointment_time) = DATE_SUB(CURDATE(), INTERVAL 2 DAY)
);

INSERT INTO appointments (patient_id, appointment_time, duration_minutes, status, notes, created_at, updated_at)
SELECT 6, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL 15 HOUR), 30, 'COMPLETED', 'สถิติย้อนหลัง', NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM appointments a
  WHERE DATE(a.appointment_time) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
);

INSERT INTO queue_entries (patient_id, queue_number, queue_date, status, notes, created_at, updated_at, started_at, completed_at)
SELECT 1, 'Q101', DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL 9 HOUR), 'COMPLETED', 'สถิติย้อนหลัง',
       DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL 9 HOUR),
       DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL 9 HOUR),
       DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL 9 HOUR) + INTERVAL 15 MINUTE,
       DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL 9 HOUR) + INTERVAL 35 MINUTE
WHERE NOT EXISTS (
  SELECT 1 FROM queue_entries q WHERE q.queue_number = 'Q101'
);

INSERT INTO queue_entries (patient_id, queue_number, queue_date, status, notes, created_at, updated_at, started_at, completed_at)
SELECT 2, 'Q102', DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL 10 HOUR), 'COMPLETED', 'สถิติย้อนหลัง',
       DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL 10 HOUR),
       DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL 10 HOUR),
       DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL 10 HOUR) + INTERVAL 10 MINUTE,
       DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL 10 HOUR) + INTERVAL 40 MINUTE
WHERE NOT EXISTS (
  SELECT 1 FROM queue_entries q WHERE q.queue_number = 'Q102'
);

INSERT INTO queue_entries (patient_id, queue_number, queue_date, status, notes, created_at, updated_at, started_at, completed_at)
SELECT 3, 'Q103', DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL 11 HOUR), 'COMPLETED', 'สถิติย้อนหลัง',
       DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL 11 HOUR),
       DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL 11 HOUR),
       DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL 11 HOUR) + INTERVAL 12 MINUTE,
       DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL 11 HOUR) + INTERVAL 45 MINUTE
WHERE NOT EXISTS (
  SELECT 1 FROM queue_entries q WHERE q.queue_number = 'Q103'
);
