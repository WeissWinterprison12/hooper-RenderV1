-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 28, 2026 at 11:51 PM
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
-- Database: `hooper_fits`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `buyer_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `login_attempts`
--

CREATE TABLE `login_attempts` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `failed_attempts` int(11) DEFAULT 0,
  `last_attempt_time` datetime DEFAULT current_timestamp(),
  `lockout_until` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `message`, `sent_at`) VALUES
(1, 2, 1, '🏀 Hooper\'s Fits Contact Form\n\n👤 Name: Ramon Lorenzo Neri\n📧 Email: shanezblankc@gmail.com\n💬 Message:\nHey ma neega\n🆔 Sender ID: 2', '2026-04-30 10:19:41'),
(2, 2, 1, '🏀 Hooper\'s Fits Contact Form\n\n👤 Name: Ramon Lorenzo Neri\n📧 Email: shanezblankc@gmail.com\n💬 Message:\nZzrotportal1234\n🆔 Sender ID: 2', '2026-04-30 10:32:06'),
(3, 2, 1, '🏀 Hooper\'s Fits Contact Form\n\n👤 Name: Ramon Lorenzo Neri\n📧 Email: shanezblankc@gmail.com\n💬 Message:\nxzdasfdsaf \n🆔 Sender ID: 2', '2026-04-30 10:33:56'),
(4, 2, 1, '🏀 Hooper\'s Fits Contact Form\n\n👤 Name: ramon\n📧 Email: Shanezblankc@gmail.com\n💬 Message:\nZzrotportal1234\n\n🆔 Sender ID: 2', '2026-05-21 21:38:30'),
(5, 2, 1, '🏀 Hooper\'s Fits Contact Form\n\n👤 Name: Ramon\n📧 Email: Shanezblankc@gmail.com\n💬 Message:\n12321321\n🆔 Sender ID: 2', '2026-05-21 21:38:49');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `buyer_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','shipped','completed','cancelled') DEFAULT 'pending',
  `cancel_reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `seller_id` int(11) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT 'COD'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `buyer_id`, `total_amount`, `status`, `cancel_reason`, `created_at`, `seller_id`, `payment_method`) VALUES
(27, 12, 2050.00, 'pending', NULL, '2026-05-25 10:52:11', NULL, 'COD'),
(28, 12, 2050.00, 'pending', NULL, '2026-05-27 13:13:32', NULL, 'COD'),
(29, 12, 2050.00, 'pending', NULL, '2026-05-27 13:13:37', NULL, 'COD'),
(30, 12, 1123173.12, 'pending', NULL, '2026-05-27 13:13:43', NULL, 'COD'),
(31, 12, 1123173.12, 'pending', NULL, '2026-05-27 13:22:07', NULL, 'COD'),
(32, 12, 1123173.12, 'pending', NULL, '2026-05-27 13:22:55', NULL, 'COD'),
(33, 12, 1123173.12, 'pending', NULL, '2026-05-27 13:23:43', NULL, 'COD'),
(34, 12, 2050.00, 'pending', NULL, '2026-05-27 13:27:34', NULL, 'COD'),
(35, 12, 2050.00, 'pending', NULL, '2026-05-27 13:28:11', NULL, 'COD');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `seller_id`, `quantity`, `price`) VALUES
(27, 27, 33, 11, 1, 2000.00),
(28, 28, 33, 11, 1, 2000.00),
(29, 29, 33, 11, 1, 2000.00),
(30, 30, 34, 11, 1, 1123123.12),
(31, 31, 34, 11, 1, 1123123.12),
(32, 32, 34, 11, 1, 1123123.12),
(33, 33, 34, 11, 1, 1123123.12),
(34, 34, 33, 11, 1, 2000.00),
(35, 35, 33, 11, 1, 2000.00);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `product_name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `seller_id`, `product_name`, `description`, `price`, `image`, `stock`, `created_at`) VALUES
(33, 11, 'Stussy Jacket', 'Stussy', 2000.00, '1778056459_3 (1).jpg', 66, '2026-05-06 08:34:19'),
(34, 11, 'Stussy jacks', '1231232', 1123123.12, '1779455243_3.jpg', 123208, '2026-05-22 13:07:23');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(15) NOT NULL,
  `address` varchar(255) NOT NULL,
  `contact` varchar(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `security_question` varchar(255) NOT NULL,
  `security_answer` varchar(255) NOT NULL,
  `profile_image` varchar(255) DEFAULT 'default-avatar.png',
  `role` enum('admin','seller','buyer') DEFAULT 'buyer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `address`, `contact`, `email`, `password`, `security_question`, `security_answer`, `profile_image`, `role`, `created_at`, `name`) VALUES
(2, 'Natnat123', 'dasma  newyork', '09228899123', 'natnat@gmail.com', '$2y$10$OdcyAu.8bg1KHO5qYrHDT.EGQ.koEkFZwomdjtO/gRroQrk.4hz3K', '', '', 'default-avatar.png', 'buyer', '2026-03-14 02:33:52', NULL),
(10, 'Adminkent', 'Arcadia Homes Subdivision, Imus, Cavite', '09396014810', 'bryanmaglian@gmail.com', '$2y$10$7CpMxFwmHOvbnTDkbx2nL.qNe1RLW0j6rQRPqeWoPjSDjQwA6yVpO', '', '', 'default-avatar.png', 'admin', '2026-03-20 20:00:06', NULL),
(11, 'Administrator', '#155 Nueno Ave. Tanzang Luma 1, Imus City, Cavite, 4103', '09396014810', 'Shanezblankc@gmail.com', '$2y$10$e259OREiLdcwOcTUzm7.jupsyTp31XVvUefWGHJd/z3FtHJXA.iHi', 'What city were you born in?', 'Kawit City', 'uploads/profiles/11_1779438971.png', 'admin', '2026-03-20 20:03:16', '123123'),
(12, 'Winterprison12', 'Blk2, Lot 26 ', '09297123619', 'ramonlorenzo.neri@cvsu.edu.ph', '$2y$10$KQE3eWLdTKFXIYCDelJIOOMiR3HjIuLAJlw8pQen1Rku54HC3Ce6m', 'What city were you born in?', 'Kawit City', 'buyer_12_1779838740.jpg', 'buyer', '2026-03-31 08:36:38', 'Bross'),
(13, 'Razeru', 'Blk2, Lot 26 ', '09946811468', 'razel.penasbo@cvsu.edu.ph', '$2y$10$3PJxx5Bbpa2MMxicznpXXOot0YQDZNzKR7LgzqEHxy6/IuFljSAMO', 'What is the name of your first pet?', '$2y$10$0qyA38YmfGRXjkINf5IGMuaLvFqvHVIjgErITxJC4coICUDl.W7K6', 'default-avatar.png', 'buyer', '2026-04-18 02:12:15', NULL),
(14, 'KenKen', 'FORT BONIFACIO TAGUIG CITY', '09082553424', 'lorebieneri@gmail.com', '$2y$10$CJ3q.dibuIXnRouh0.a4eOxAspr1p3wJVJfOv82HaLFoOJPvWfvA.', 'What is the name of your first pet?', '$2y$10$9EKhmCz0oIEl.8pDw0mu3Of9aFldnBsceitlf1.pJ58yF7sP/vfp.', 'default-avatar.png', 'buyer', '2026-04-18 02:14:54', NULL),
(15, 'KenKenn', 'FORT BONIFACIO TAGUIG CITY', '09082553421', 'kentbryan@gmail.com', '$2y$10$nJeHM1HeDiNWIYoRPyA.jef1sL0ogpx/btD7uzXnRI7cVlWZS3/uu', 'What is the name of your first pet?', '$2y$10$4IsFbnoqUfu8N81xtXDepOwOLJm9aUU5NhOCIME63dSDaWeclCRvO', 'default-avatar.png', 'buyer', '2026-04-18 02:26:12', NULL),
(16, 'Adrianeravil', '799 p.libertino', '09354384119', 'adrianeravil.rellosa@gmail.com', '$2y$10$7jF8OQ6aRFE9/7/7vwmwPezZmvgvHDcbW.EReRw.yFkuXgvL.rskq', 'What is the name of your first pet?', '$2y$10$oH2TRgiMVaTW4.U9AdBITupXNJ4JF26MVgtD.dtnxVI5xx8vp9iMy', 'default-avatar.png', 'buyer', '2026-04-18 02:33:16', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `buyer_id` (`buyer_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `login_attempts`
--
ALTER TABLE `login_attempts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_username` (`username`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `buyer_id` (`buyer_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `seller_id` (`seller_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_seller_id` (`seller_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `login_attempts`
--
ALTER TABLE `login_attempts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
