-- MySQL dump 10.13  Distrib 8.0.23, for Win64 (x86_64)
--
-- Host: ucip-dev-2022-cluster.cluster-ro-cl9o0dc8m8b9.ap-southeast-1.rds.amazonaws.com    Database: ucip-dev
-- ------------------------------------------------------
-- Server version	5.7.12-log

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
-- Table structure for table `sub_roles`
--

DROP TABLE IF EXISTS `sub_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sub_roles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `admin_role_id` int(10) unsigned NOT NULL,
  `user_role_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `adminRoleKey_idx` (`admin_role_id`),
  KEY `userRoleKey_idx` (`user_role_id`),
  CONSTRAINT `adminRoleKey` FOREIGN KEY (`admin_role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `userRoleKey` FOREIGN KEY (`user_role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_roles`
--

LOCK TABLES `sub_roles` WRITE;
/*!40000 ALTER TABLE `sub_roles` DISABLE KEYS */;
INSERT INTO `sub_roles` VALUES (2,4,11),(3,9,12),(5,13,15),(6,16,17),(8,16,19),(9,16,20),(12,4,27),(13,9,33),(14,4,21),(15,4,24),(16,33,12),(27,1,71),(34,1,74),(35,74,75),(36,1,75),(37,75,76),(38,74,76),(39,1,76),(40,1,81),(41,81,82),(42,1,82),(43,82,83),(44,81,83),(45,1,83),(46,1,84),(47,84,85),(48,1,85),(49,85,86),(50,84,86),(51,1,86),(52,71,87),(53,1,87),(54,87,88),(55,71,88),(56,1,88),(57,1,89),(58,89,90),(59,1,90),(60,90,91),(61,89,91),(62,1,91),(63,1,92),(64,92,93),(65,1,93),(66,93,94),(67,92,94),(68,1,94),(69,1,95),(70,95,96),(71,1,96),(72,96,97),(73,95,97),(74,1,97),(86,1,103),(87,103,104),(88,1,104),(89,104,105),(90,103,105),(91,1,105),(92,104,106),(93,103,106),(94,1,106),(95,104,107),(96,103,107),(97,1,107),(102,1,116);
/*!40000 ALTER TABLE `sub_roles` ENABLE KEYS */;
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

-- Dump completed on 2022-09-06  9:39:35
