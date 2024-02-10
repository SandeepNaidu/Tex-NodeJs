CREATE DATABASE  IF NOT EXISTS `ucipdev` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ucipdev`;
-- MySQL dump 10.13  Distrib 8.0.17, for macos10.14 (x86_64)
--
-- Host: srini-test.cl9o0dc8m8b9.ap-southeast-1.rds.amazonaws.com    Database: ucipdev
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `ucip_sys_params`
--

DROP TABLE IF EXISTS `ucip_sys_params`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ucip_sys_params` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sys_param_code` varchar(100) NOT NULL,
  `sys_param_name` varchar(100) NOT NULL,
  `sys_param_value` varchar(400) NOT NULL,
  `sys_param_description` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sys_param_code_UNIQUE` (`sys_param_code`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ucip_sys_params`
--

LOCK TABLES `ucip_sys_params` WRITE;
/*!40000 ALTER TABLE `ucip_sys_params` DISABLE KEYS */;
INSERT INTO `ucip_sys_params` VALUES (1,'NOTIFY_EMAIL_ADDRESS_FOR_CAMPAIGN','Email Address for Campaign Notification ','saurav_tripatitcs@astro.com.my;sai_vardhantcs@astro.com.my;bharath_reddytcs@astro.com.my','User email addresses to be notified via email for action regarding campaign'),(2,'NOTIFY_EMAIL_ADDRESS_FOR_AGENCY_ACTIVITY','Email Address for Agency Activity  Notification','saurav_tripatitcs@astro.com.my;sai_vardhantcs@astro.com.my;bharath_reddytcs@astro.com.my','User email addresses to be notified via email for action regarding agency activity');
/*!40000 ALTER TABLE `ucip_sys_params` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-11-18 14:51:00
