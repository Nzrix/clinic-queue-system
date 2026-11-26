-- Insert demo staff user (password: demo123)
-- Password is BCrypt hashed version of 'demo123'
INSERT INTO users (username, password, full_name, role, active, created_at, updated_at)
VALUES ('demo', '$2a$10$rB.HXiQ8ZGvKLHLWCf8pMeW8GZ8F8QQ8yQ8YQ8ZQ8aQ8bQ8cQ8dQ8e', 'สมชาย ใจดี', 'STAFF', TRUE, NOW(), NOW());

-- Insert sample patients
INSERT INTO patients (name, phone, notes, active, created_at, updated_at) VALUES
('สมหญิง รักษ์ดี', '0812345678', 'ประวัติแพ้ยาพาราเซตามอล', TRUE, NOW(), NOW()),
('สมศักดิ์ มีสุข', '0823456789', 'โรคเบาหวาน', TRUE, NOW(), NOW()),
('สมใจ สุขใจ', '0834567890', NULL, TRUE, NOW(), NOW()),
('วิภา ใจงาม', '0845678901', 'โรคความดันโลหิตสูง', TRUE, NOW(), NOW()),
('ประยุทธ์ มั่นคง', '0856789012', NULL, TRUE, NOW(), NOW()),
('สุภาพ นิ่มนวล', '0867890123', 'ผู้สูงอายุ ใช้เวลานานหน่อย', TRUE, NOW(), NOW()),
('รุ่งรัตน์ เจริญ', '0878901234', NULL, TRUE, NOW(), NOW()),
('ชัยวัฒน์ ก้าวหน้า', '0889012345', 'ติดตามอาการไอเรื้อรัง', TRUE, NOW(), NOW());

-- Insert sample appointments for today and tomorrow
INSERT INTO appointments (patient_id, appointment_time, duration_minutes, status, notes, created_at, updated_at) VALUES
(1, DATE_ADD(CURDATE(), INTERVAL 9 HOUR), 30, 'SCHEDULED', 'ตรวจสุขภาพประจำปี', NOW(), NOW()),
(2, DATE_ADD(CURDATE(), INTERVAL 10 HOUR), 30, 'SCHEDULED', 'ติดตามระดับน้ำตาล', NOW(), NOW()),
(3, DATE_ADD(CURDATE(), INTERVAL 11 HOUR), 30, 'SCHEDULED', NULL, NOW(), NOW()),
(4, DATE_ADD(CURDATE(), INTERVAL 14 HOUR), 30, 'SCHEDULED', 'วัดความดัน', NOW(), NOW()),
(5, DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 1 DAY), INTERVAL 9 HOUR), 30, 'SCHEDULED', NULL, NOW(), NOW()),
(6, DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 1 DAY), INTERVAL 10 HOUR), 30, 'SCHEDULED', 'ตรวจสุขภาพผู้สูงอายุ', NOW(), NOW());

-- Insert sample queue entries for today
INSERT INTO queue_entries (patient_id, queue_number, queue_date, status, notes, created_at, updated_at) VALUES
(7, 'Q001', NOW(), 'WAITING', NULL, NOW(), NOW()),
(8, 'Q002', NOW(), 'WAITING', NULL, NOW(), NOW());
