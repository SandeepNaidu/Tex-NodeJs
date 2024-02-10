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
-- Table structure for table `ucip_business_unit_user_types`
--

DROP TABLE IF EXISTS `ucip_business_unit_user_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ucip_business_unit_user_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_unit_id` int(11) NOT NULL,
  `user_type_id` int(11) NOT NULL,
  `parent_user_type_id` int(11) DEFAULT NULL,
  `createdBy` varchar(45) DEFAULT NULL,
  `createdOn` timestamp NULL DEFAULT NULL,
  `updatedBy` varchar(45) DEFAULT NULL,
  `updatedOn` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ucip_business_unit_user_types`
--

LOCK TABLES `ucip_business_unit_user_types` WRITE;
/*!40000 ALTER TABLE `ucip_business_unit_user_types` DISABLE KEYS */;
INSERT INTO `ucip_business_unit_user_types` VALUES (1,1,1,6,NULL,NULL,NULL,NULL),(2,1,2,1,NULL,NULL,NULL,NULL),(3,2,3,2,NULL,NULL,NULL,NULL),(4,1,3,2,NULL,NULL,NULL,NULL),(5,2,1,6,NULL,NULL,NULL,NULL),(6,2,2,1,NULL,NULL,NULL,NULL),(7,3,1,6,NULL,NULL,NULL,NULL),(8,3,2,1,NULL,NULL,NULL,NULL),(9,3,3,2,NULL,NULL,NULL,NULL),(10,4,1,6,NULL,NULL,NULL,NULL),(11,4,2,1,NULL,NULL,NULL,NULL),(12,4,3,2,NULL,NULL,NULL,NULL),(13,5,1,6,NULL,NULL,NULL,NULL),(14,5,2,1,NULL,NULL,NULL,NULL),(15,5,3,2,NULL,NULL,NULL,NULL),(16,6,1,6,NULL,NULL,NULL,NULL),(17,6,2,1,NULL,NULL,NULL,NULL),(18,6,3,2,NULL,NULL,NULL,NULL),(19,7,1,6,NULL,NULL,NULL,NULL),(20,7,2,1,NULL,NULL,NULL,NULL),(21,7,3,2,NULL,NULL,NULL,NULL),(22,8,6,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `ucip_business_unit_user_types` ENABLE KEYS */;
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

-- Dump completed on 2022-09-06  9:39:41
