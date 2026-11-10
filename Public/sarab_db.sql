-- Sarab Restaurant & Fast Food Database
-- Migration & Seed Script

CREATE DATABASE IF NOT EXISTS `sarab_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `sarab_db`;

-- 1. Admins Table
DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default Admin: admin / password
INSERT INTO `admins` (`username`, `password`) VALUES
('admin', '$2y$10$AUrrEeOc02uzB71xW3VrgeumM/jQ7HcEWWsGnqhYmSC3FUmWsXcvq');

-- 2. Table Reservations Table
DROP TABLE IF EXISTS `reservations`;
CREATE TABLE `reservations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `guests` VARCHAR(20) NOT NULL,
  `res_date` DATE NOT NULL,
  `res_time` VARCHAR(20) NOT NULL,
  `special_requests` TEXT DEFAULT NULL,
  `status` ENUM('Pending', 'Confirmed', 'Cancelled') NOT NULL DEFAULT 'Pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Pre-seeded Reservations
INSERT INTO `reservations` (`full_name`, `phone`, `email`, `guests`, `res_date`, `res_time`, `special_requests`, `status`, `created_at`) VALUES
('Kasun Fernando', '0771234567', 'kasun@gmail.com', '4 Persons', '2026-11-10', '07:00 PM', 'Window table preferred, birthday celebration.', 'Confirmed', NOW() - INTERVAL 4 HOUR),
('Dilani Silva', '0719876543', 'dilani.s@yahoo.com', '2 Persons', '2026-11-11', '08:00 PM', 'Anniversary dinner setup.', 'Pending', NOW() - INTERVAL 2 HOUR),
('Nuwan Wickramasinghe', '0765551234', 'nuwan.w@outlook.com', '6+ Persons', '2026-11-12', '01:00 PM', 'Corporate lunch booking for 8 guests.', 'Pending', NOW());

-- 3. Contact Inquiries Table
DROP TABLE IF EXISTS `contacts`;
CREATE TABLE `contacts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `subject` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('Unread', 'Read', 'Replied') NOT NULL DEFAULT 'Unread',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Pre-seeded Inquiries
INSERT INTO `contacts` (`full_name`, `email`, `phone`, `subject`, `message`, `status`, `created_at`) VALUES
('Sahan Perera', 'sahan@gmail.com', '0772345678', 'Catering & Events', 'Inquiring about outdoor catering packages for an office party of 40 people in Colombo 03.', 'Unread', NOW() - INTERVAL 1 HOUR),
('Anushka Senanayake', 'anushka@hotmail.com', '0789012345', 'Feedback / Suggestions', 'The smash burgers were incredible! Would love to see more vegan burger options on the menu.', 'Read', NOW() - INTERVAL 5 HOUR);