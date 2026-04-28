-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 28, 2026 at 03:39 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project_mun`
--

-- --------------------------------------------------------

--
-- Table structure for table `hero_slides`
--

CREATE TABLE `hero_slides` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `button_text` varchar(100) DEFAULT 'Learn More',
  `button_link` varchar(255) DEFAULT '#portfolio',
  `image_url` varchar(500) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hero_slides`
--

INSERT INTO `hero_slides` (`id`, `title`, `subtitle`, `description`, `button_text`, `button_link`, `image_url`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'We Build Digital Experiences', 'Creative Solutions', 'We are a team of passionate developers crafting innovative web solutions for modern businesses. From concept to deployment, we bring your vision to life.', 'View Portfolio', '#portfolio', 'uploads/hero/69dc7e11af68d.png', 0, 1, '2026-04-13 05:19:58', '2026-04-13 05:24:33'),
(2, 'Gym Management System', 'Smart Fitness Management Made Easy', 'A complete gym management system designed to streamline daily operations. It allows tracking of member registrations, attendance, subscriptions, and payments while providing an organized dashboard for admins and staff. Built to improve efficiency and enhance the overall gym experience.', 'View System', '#portfolio', 'uploads/hero/69dc7ece6b802.png', 1, 1, '2026-04-13 05:27:42', '2026-04-13 05:27:42'),
(3, 'Inventory Management System', 'Track, Manage, and Optimize Your Inventory', 'A powerful inventory management system that helps businesses monitor stock levels, track product movement, and manage orders in real time. It includes features like low-stock alerts, sales tracking, and detailed reporting to improve accuracy and decision-making.', 'View System', '#portfolio', 'uploads/hero/69dc7fb3d7db3.png', 2, 1, '2026-04-13 05:31:31', '2026-04-13 05:31:31');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `subject` varchar(200) DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `project_url` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `image_filename` varchar(255) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `video_filename` varchar(255) DEFAULT NULL,
  `video_path` varchar(255) DEFAULT NULL,
  `video_two_filename` varchar(255) DEFAULT NULL,
  `video_two_path` varchar(255) DEFAULT NULL,
  `featured` tinyint(1) DEFAULT 0,
  `tech` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `title`, `description`, `image_url`, `project_url`, `category`, `created_at`, `image_filename`, `image_path`, `video_filename`, `video_path`, `video_two_filename`, `video_two_path`, `featured`, `tech`) VALUES
(10, 'Ecommerce', 'E-commerce (electronic commerce) is the buying and selling of goods and services over the internet. It allows businesses and customers to transact online through websites or mobile apps, making shopping more convenient and accessible anytime, anywhere.', NULL, '', 'Web Development', '2026-04-13 00:59:12', 'c7b42349da85e97d1d15f1f34287e692.png', 'C:\\xampp\\htdocs\\project-mun\\backend\\api/../uploads/c7b42349da85e97d1d15f1f34287e692.png', '24b875442b2d080110a7f593180ef13b.mp4', 'C:\\xampp\\htdocs\\project-mun\\backend\\api/../uploads/24b875442b2d080110a7f593180ef13b.mp4', NULL, NULL, 0, NULL),
(11, 'Gym Management System', 'A complete gym management system designed to streamline daily operations. It allows tracking of member registrations, attendance, subscriptions, and payments while providing an organized dashboard for admins and staff. Built to improve efficiency and enhance the overall gym experience.', NULL, '', 'Web Development', '2026-04-13 05:53:10', '4c48996af74104794587806588f0cc48.png', 'C:\\xampp\\htdocs\\project-mun\\backend\\api/../uploads/4c48996af74104794587806588f0cc48.png', NULL, NULL, NULL, NULL, 0, NULL),
(12, 'Inventory Management System', 'A powerful inventory management system that helps businesses monitor stock levels, track product movement, and manage orders in real time. It includes features like low-stock alerts, sales tracking, and detailed reporting to improve accuracy and decision-making.', NULL, '', 'Web Development', '2026-04-13 05:53:47', '3fcec34f2065ca4b7137322df336c93b.png', 'C:\\xampp\\htdocs\\project-mun\\backend\\api/../uploads/3fcec34f2065ca4b7137322df336c93b.png', NULL, NULL, NULL, NULL, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `icon` varchar(50) DEFAULT 'Code',
  `color` varchar(20) DEFAULT 'blue',
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features`)),
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `title`, `description`, `icon`, `color`, `features`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 'Web Development', 'Custom web applications built with modern frameworks.', 'Code', 'blue', '[\"React.js\", \"Node.js\", \"RESTful APIs\"]', 0, '2026-04-12 05:31:25', '2026-04-12 05:31:25'),
(2, 'UI/UX Design', 'User-centered design for intuitive digital experiences.', 'Palette', 'purple', '[\"Wireframing\", \"Prototyping\"]', 1, '2026-04-12 05:31:25', '2026-04-12 05:31:25'),
(3, 'System Development', 'Robust backend systems using PHP and MySQL.', 'Database', 'green', '[\"PHP\", \"MySQL\"]', 2, '2026-04-12 05:31:25', '2026-04-12 05:31:25'),
(4, 'E-Commerce Solutions', 'Complete online store development.', 'Globe', 'orange', '[\"Payment Gateways\"]', 3, '2026-04-12 05:31:25', '2026-04-12 05:31:25'),
(5, 'Responsive Design', 'Mobile-first approach for all devices.', 'Smartphone', 'pink', '[\"Mobile-First\"]', 4, '2026-04-12 05:31:25', '2026-04-12 05:31:25'),
(6, 'Website Maintenance', 'Ongoing support and updates.', 'Layout', 'indigo', '[\"Security Updates\"]', 5, '2026-04-12 05:31:25', '2026-04-12 05:31:25'),
(7, 'ds', 'sdsfs', 'Code', 'blue', '[]', 6, '2026-04-12 05:35:06', '2026-04-12 05:35:06');

-- --------------------------------------------------------

--
-- Table structure for table `skills`
--

CREATE TABLE `skills` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `color` varchar(7) DEFAULT '#3B82F6',
  `proficiency` int(11) DEFAULT 80,
  `is_active` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `skills`
--

INSERT INTO `skills` (`id`, `name`, `category`, `color`, `proficiency`, `is_active`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 'React.js', 'Frontend', '#61DAFB', 90, 1, 0, '2026-04-12 05:42:26', '2026-04-12 05:42:26'),
(2, 'JavaScript', 'Language', '#F7DF1E', 95, 1, 1, '2026-04-12 05:42:26', '2026-04-12 05:42:26'),
(3, 'PHP', 'Backend', '#777BB4', 85, 1, 2, '2026-04-12 05:42:26', '2026-04-12 05:42:26'),
(4, 'MySQL', 'Database', '#4479A1', 80, 1, 3, '2026-04-12 05:42:26', '2026-04-12 05:42:26'),
(5, 'Node.js', 'Backend', '#339933', 75, 1, 4, '2026-04-12 05:42:26', '2026-04-12 05:42:26'),
(6, 'Git', 'Tools', '#F05032', 85, 1, 5, '2026-04-12 05:42:26', '2026-04-12 05:42:26'),
(7, 'Python', 'Backend', '#3776AB', 70, 1, 6, '2026-04-12 05:42:26', '2026-04-12 05:42:26'),
(8, 'Laravel', 'Backend', '#FF2D20', 65, 1, 7, '2026-04-12 05:42:26', '2026-04-12 05:42:26'),
(9, 'Tailwind CSS', 'Styling', '#38BDF8', 90, 1, 8, '2026-04-12 05:42:26', '2026-04-12 05:42:26'),
(10, 'C++', 'Language', '#00599C', 60, 1, 9, '2026-04-12 05:42:26', '2026-04-12 05:42:26'),
(11, 'Java', 'Language', '#F8981D', 55, 1, 10, '2026-04-12 05:42:26', '2026-04-12 05:42:26'),
(12, 'Electron.js', 'Framework', '#47848F', 50, 1, 11, '2026-04-12 05:42:26', '2026-04-12 05:42:26');

-- --------------------------------------------------------

--
-- Table structure for table `team_members`
--

CREATE TABLE `team_members` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `role` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `initials` varchar(10) DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `github` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `image_url` varchar(500) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `team_members`
--

INSERT INTO `team_members` (`id`, `name`, `role`, `description`, `initials`, `linkedin`, `github`, `email`, `created_at`, `image_url`, `display_order`) VALUES
(1, 'Ruben Albao', 'Frontend Developer', 'Expert in React, JavaScript, and modern frontend frameworks. Creates responsive and interactive user interfaces.', 'RA', 'http://localhost:3000/admin/about', 'http://localhost:3000/admin/about', 'maruben@projectmun.com', '2026-04-10 09:55:20', 'uploads/team/69dc57ae569fd.png', 0),
(2, 'Kristian Gomez', 'Frontend Developer', 'Specialized in React.js and modern JavaScript. Creates responsive and interactive user interfaces.', 'KG', 'http://localhost:3000/admin/about', 'http://localhost:3000/admin/about', 'kristian@projectmun.com', '2026-04-10 09:55:20', 'uploads/team/69dc572bb6803.png', 0),
(3, 'Jonelle Mayari', 'Project Manager', 'Oversees project timelines, client communication, and ensures successful delivery of all projects.', 'JM', 'http://localhost:3000/admin/about', 'http://localhost:3000/admin/about', 'jonelle@projectmun.com', '2026-04-10 09:55:20', 'uploads/team/69dc5766f28d2.png', 0),
(4, 'Alvin Panganiban', 'Backend Developer', 'Expert in server-side development, APIs, and database architecture. Powers the backend infrastructure.', 'AP', 'http://localhost:3000/admin/about', 'http://localhost:3000/admin/about', 'alvin@projectmun.com', '2026-04-10 09:55:20', 'uploads/team/69dc578e5a28b.png', 0);

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `rating` int(11) DEFAULT 5,
  `image_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `testimonials`
--

INSERT INTO `testimonials` (`id`, `name`, `role`, `content`, `rating`, `image_url`, `is_active`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 'Maria Santos', 'CEO, TechStart Philippines', 'Project MUN delivered an exceptional e-commerce platform that exceeded our expectations. Their attention to detail and technical expertise are unmatched.', 5, NULL, 1, 0, '2026-04-12 05:33:51', '2026-04-12 05:33:51'),
(2, 'John Reyes', 'Marketing Director, InnovateCorp', 'Working with the Project MUN team was a game-changer for our business. They transformed our outdated website into a modern, high-converting platform.', 5, NULL, 1, 1, '2026-04-12 05:33:51', '2026-04-12 05:33:51'),
(3, 'Sarah Chen', 'Founder, EduLearn Platform', 'The learning management system they built is incredible. User-friendly for both students and instructors, with all the features we needed.', 5, NULL, 1, 2, '2026-04-12 05:33:51', '2026-04-12 05:33:51'),
(4, 'David Lim', 'Operations Manager, FoodHub PH', 'Our restaurant booking system has streamlined operations and increased reservations by 40%. Highly recommend their services!', 5, NULL, 1, 3, '2026-04-12 05:33:51', '2026-04-12 05:33:51'),
(5, 'ssd', 'sds', 'sdsfs', 5, '', 1, 4, '2026-04-12 05:37:07', '2026-04-12 05:37:07');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `phone` varchar(50) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `phone`, `location`, `bio`, `updated_at`) VALUES
(1, 'Administrator', 'admin@gmail.com', 'password', 'admin', '2026-04-10 23:02:43', '', '', '', '2026-04-13 07:02:31');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `hero_slides`
--
ALTER TABLE `hero_slides`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `skills`
--
ALTER TABLE `skills`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `team_members`
--
ALTER TABLE `team_members`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `hero_slides`
--
ALTER TABLE `hero_slides`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `skills`
--
ALTER TABLE `skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `team_members`
--
ALTER TABLE `team_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
