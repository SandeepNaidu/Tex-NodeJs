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
-- Table structure for table `ucip_agencies`
--

DROP TABLE IF EXISTS `ucip_agencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ucip_agencies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `agencyCode` varchar(45) DEFAULT NULL,
  `agencyName` varchar(100) DEFAULT NULL,
  `agencyLimit` int(11) DEFAULT NULL,
  `agencyPIC` varchar(45) DEFAULT NULL,
  `loginTime` time DEFAULT NULL,
  `logoutTime` time DEFAULT NULL,
  `createdBy` varchar(100) DEFAULT NULL,
  `creationDate` timestamp NULL DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  `updationDate` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ucip_agencies`
--

LOCK TABLES `ucip_agencies` WRITE;
/*!40000 ALTER TABLE `ucip_agencies` DISABLE KEYS */;
INSERT INTO `ucip_agencies` VALUES (1,'TEST_AGENCY_EDIT','Test Agency Name',30,'Test','09:00:00','20:00:00',NULL,NULL,NULL,NULL),(2,'TEST_AGENCY_2','Test Agency 2',30,'Test','08:00:00','15:00:00',NULL,NULL,NULL,NULL),(3,'MPC2','MPC2 Agency',NULL,'MPC','09:00:00','13:30:00',NULL,NULL,NULL,NULL),(4,'MPC','MPC',NULL,'MPC','00:00:00','23:45:00',NULL,NULL,NULL,NULL),(6,'MPC','MPC test',NULL,'MPC','00:00:00','23:45:00',NULL,NULL,NULL,NULL),(7,'MPC','MPC test',NULL,'MPC','00:00:00','00:00:00',NULL,NULL,NULL,NULL),(8,'MPC','MPC test',NULL,'MPC','00:00:00','23:45:00',NULL,NULL,NULL,NULL),(9,'MPC','MPC test',NULL,'MPC','00:00:00','00:00:00',NULL,NULL,NULL,NULL),(10,'MPC','MPC test2',NULL,'MPC','00:00:00','23:30:00',NULL,NULL,NULL,NULL),(11,'MPC','MPC test',NULL,'MPC','00:00:00','23:00:00',NULL,NULL,NULL,NULL),(13,'MPC','MPC test',NULL,'MPC','00:00:00','23:45:00',NULL,NULL,NULL,NULL),(14,'MPC','MPC Agency',NULL,'Test PIC','00:00:00','23:45:00',NULL,NULL,NULL,NULL),(15,'SDA','SDA Agency',NULL,'SDA PIC','00:00:00','23:45:00',NULL,NULL,NULL,NULL),(16,'SDA','SDA Agency',NULL,'test PIC','00:00:00','23:45:00',NULL,NULL,NULL,NULL),(17,'MPC_TEST_AGENCY','MPC Test Agency',NULL,'MPC PIC','04:00:00','10:00:00',NULL,NULL,NULL,NULL),(18,'TPS','TPS Agency Edit',NULL,'Test TPS PIC','00:00:00','03:15:00',NULL,NULL,NULL,NULL),(19,'CRM','CRM Agency',NULL,NULL,'09:00:00','20:30:00',NULL,NULL,NULL,NULL),(20,'BSM','BSM Agency',NULL,NULL,'00:00:00','19:00:00',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `ucip_agencies` ENABLE KEYS */;
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

-- Dump completed on 2022-09-06  9:39:33
