-- Initialize database with sample data
-- This file runs automatically when the database container starts

USE nuit_info;

-- The User model will create the table automatically via Sequelize
-- This is just for reference and initial seed data

-- Sample users will be created by the API on first run
-- You can add custom initialization SQL here if needed

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT 'user',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample users
INSERT INTO `users` (`name`, `email`, `role`, `createdAt`, `updatedAt`) VALUES
('John Doe', 'john@example.com', 'admin', NOW(), NOW()),
('Jane Smith', 'jane@example.com', 'user', NOW(), NOW()),
('Bob Johnson', 'bob@example.com', 'moderator', NOW(), NOW());
