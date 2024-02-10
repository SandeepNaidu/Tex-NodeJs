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
-- Table structure for table `ucip_lookup_codes`
--

DROP TABLE IF EXISTS `ucip_lookup_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ucip_lookup_codes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lookup_type` varchar(100) DEFAULT NULL,
  `lookup_code` varchar(100) DEFAULT NULL,
  `display_field` varchar(150) DEFAULT NULL,
  `createdBy` varchar(100) DEFAULT NULL,
  `creationDate` timestamp NULL DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  `updationDate` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ucip_lookup_codes`
--

LOCK TABLES `ucip_lookup_codes` WRITE;
/*!40000 ALTER TABLE `ucip_lookup_codes` DISABLE KEYS */;
INSERT INTO `ucip_lookup_codes` VALUES (1,'USER_TYPES','ASTRO_ADM','Astro Admin','superAdmin',NULL,NULL,NULL),(2,'USER_TYPES','AGENT_ADM','Agent Admin','superAdmin',NULL,NULL,NULL),(3,'USER_TYPES','AGENT','Agent','superAdmin',NULL,NULL,NULL),(7,'BUSINESS_UNIT','CIP','CIP','superAdmin',NULL,NULL,NULL),(8,'BUSINESS_UNIT','WIN_LEAD','Win Lead','superAdmin',NULL,NULL,NULL),(9,'BUSINESS_UNIT','WIN_BACK','Win Back','superAdmin',NULL,NULL,NULL);
/*!40000 ALTER TABLE `ucip_lookup_codes` ENABLE KEYS */;
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

-- Dump completed on 2022-09-06  9:39:31