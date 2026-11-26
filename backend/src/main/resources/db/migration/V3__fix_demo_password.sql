-- Use a freshly generated BCrypt hash for "demo123"
-- Generated via Spring BCryptPasswordEncoder in test
DELETE FROM users WHERE username = 'demo';
INSERT INTO users (username, password, full_name, role, active, created_at, updated_at)
VALUES ('demo', '$2a$10$yFhKxtnoA/FgHewqEFA0oupWIc5qkk6fGnhpb5AUQbKmYceQ5qz4e', 'สมชาย ใจดี', 'STAFF', TRUE, NOW(), NOW());
