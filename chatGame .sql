-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 24, 2017 at 06:18 PM
-- Server version: 5.7.17-0ubuntu0.16.04.1
-- PHP Version: 7.0.15-0ubuntu0.16.04.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chatGame`
--

-- --------------------------------------------------------

--
-- Table structure for table `friends`
--

CREATE TABLE `friends` (
  `friend1` varchar(20) NOT NULL,
  `friend2` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `friends`
--

INSERT INTO `friends` (`friend1`, `friend2`) VALUES
('ahmed', 'ali'),
('ahmed', 'amira'),
('ahmed', 'foda'),
('ali', 'ahmed'),
('amira', 'ahmed'),
('amira', 'foda'),
('atta', 'foda'),
('foda', 'ahmed'),
('foda', 'amira'),
('foda', 'atta');

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `gr_id` int(11) NOT NULL,
  `gr_name` varchar(30) NOT NULL,
  `creator_name` varchar(20) NOT NULL,
  `image` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`gr_id`, `gr_name`, `creator_name`, `image`) VALUES
(1, 'os-group', 'atta', NULL),
(2, 'sd-group', 'foda', NULL),
(3, 'fun-group', 'amira', NULL),
(4, 'new-group', 'atta', 'img/path');

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

CREATE TABLE `members` (
  `user_name` varchar(20) NOT NULL,
  `group_name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `members`
--

INSERT INTO `members` (`user_name`, `group_name`) VALUES
('ahmed', 'fun-group'),
('ahmed', 'os-group'),
('ahmed', 'sd-group'),
('ali', 'fun-group'),
('ali', 'os-group'),
('amira', 'os-group'),
('foda', 'fun-group'),
('yomna', 'os-group');

-- --------------------------------------------------------

--
-- Table structure for table `requests`
--

CREATE TABLE `requests` (
  `sender` varchar(20) NOT NULL,
  `receiver` varchar(20) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `u_id` int(11) NOT NULL,
  `u_name` varchar(20) NOT NULL,
  `pass` varchar(10) NOT NULL,
  `msg` int(11) NOT NULL DEFAULT '0',
  `u_image` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`u_id`, `u_name`, `pass`, `msg`, `u_image`) VALUES
(1, 'atta', 'iti', 7, NULL),
(2, 'ahmed', 'iti', 2, NULL),
(3, 'foda', 'iti', 5, NULL),
(4, 'amira', 'iti', 0, NULL),
(5, 'ali', 'iti', 8, NULL),
(6, 'mona', 'iti', 0, NULL),
(7, 'yomna', 'iti', 0, 'ddd/ddd');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`friend1`,`friend2`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`gr_id`),
  ADD UNIQUE KEY `gr_name` (`gr_name`);

--
-- Indexes for table `members`
--
ALTER TABLE `members`
  ADD PRIMARY KEY (`user_name`,`group_name`);

--
-- Indexes for table `requests`
--
ALTER TABLE `requests`
  ADD PRIMARY KEY (`sender`,`receiver`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`u_id`),
  ADD UNIQUE KEY `name` (`u_name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `gr_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `u_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
