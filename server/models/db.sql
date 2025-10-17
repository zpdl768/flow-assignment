-- Create database
CREATE DATABASE IF NOT EXISTS file_upload_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE file_upload_db;

-- 고정 확장자 테이블
CREATE TABLE IF NOT EXISTS fixed_extensions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_blocked (is_blocked)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 커스텀 확장자 테이블
CREATE TABLE IF NOT EXISTS custom_extensions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 고정 확장자 초기 데이터 (기본 uncheck 상태)
INSERT INTO fixed_extensions (name, is_blocked) VALUES
('bat', FALSE),
('cmd', FALSE),
('com', FALSE),
('cpl', FALSE),
('exe', FALSE),
('scr', FALSE),
('js', FALSE)
ON DUPLICATE KEY UPDATE name=name;
