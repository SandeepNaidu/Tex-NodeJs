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
-- Table structure for table `wld_alert`
--

DROP TABLE IF EXISTS `wld_alert`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wld_alert` (
  `ALERT_MSG` varchar(4000) DEFAULT NULL,
  `PRIORITY` varchar(3) DEFAULT NULL,
  `ISACTIVE` varchar(1) DEFAULT NULL,
  `CHECK` varchar(50) DEFAULT NULL,
  `RAG` varchar(10) DEFAULT NULL,
  `ALERT_ID` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`ALERT_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wld_alert`
--

LOCK TABLES `wld_alert` WRITE;
/*!40000 ALTER TABLE `wld_alert` DISABLE KEYS */;
INSERT INTO `wld_alert` VALUES ('This is a new test alert message','1','1','0','G',1),('Important: Application contain Nielsen under personal or commercial submission, please check account flashes at 0943100896 for relevant contact no., email, PIC. Obtain VT HOD approval if any','3','1','','G',7),('test','2','1','1','A',9),('testalert','2','1','0','R',12),('srini test','2','1','1','A',13),('test','1','1','1','A',14),('test','1','1','1','A',15),('sda','2','1','1','G',16),('sda','2','1','1','G',17),('tuyt','2','1','1','R',18),('jjjjgjhg','3','1','0','A',19),('sdaf','3','0','0','A',20),('sdaf','3','0','0','A',21),('klmlkkanjlnlnk','3','1','1','R',22),('klmlkkanjlnlnk','3','1','1','R',23),('klmlkkanjlnlnk','3','1','1','R',24),('test','1','1','1','R',25);
/*!40000 ALTER TABLE `wld_alert` ENABLE KEYS */;
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

-- Dump completed on 2022-09-06  9:39:42
