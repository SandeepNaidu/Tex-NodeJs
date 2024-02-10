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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `firstName` varchar(45) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `lastName` varchar(45) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `username` varchar(45) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(5000) COLLATE utf8mb4_0900_ai_ci DEFAULT '',
  `email` varchar(45) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `contactNumber` varchar(15) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `roleId` int(10) unsigned NOT NULL,
  `parentUserId` int(11) DEFAULT NULL,
  `agencyId` int(11) DEFAULT NULL,
  `agencyPIC` varchar(100) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `reportingManager` varchar(100) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `reportingManagerEmail` varchar(200) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `reportingLocation` varchar(45) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `resourceType` varchar(45) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `employeeId` varchar(100) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `loginTime` time DEFAULT NULL,
  `logoutTime` time DEFAULT NULL,
  `isActive` int(11) NOT NULL DEFAULT '1',
  `isDeleted` varchar(1) COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'N',
  `userDeletedAt` datetime DEFAULT NULL,
  `creationDate` datetime NOT NULL,
  `createdBy` varchar(45) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `updationDate` datetime NOT NULL,
  `updatedBy` varchar(45) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `notes` tinytext COLLATE utf8mb4_0900_ai_ci,
  `forceReset` tinyint(4) DEFAULT '0',
  `verifyCode` varchar(2000) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `verifyCodeExp` datetime DEFAULT NULL,
  `encryptedPassword` varchar(5000) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `unique_username` (`username`),
  KEY `roleIdKey_idx` (`roleId`),
  KEY `username_idx` (`username`),
  CONSTRAINT `roleIdKey` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1358 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Super','Admin','superadmin','$2a$10$AEAdQJctBAiWwhEMu9zjMefhCAqAUNCgWjn.ogpwFMBeWxG4xNc06','srini@gmail.com','6012312312',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2021-01-05 10:45:30','1','2021-01-05 10:45:30',NULL,'-',0,'$2a$10$5nJ0H85QJR1xIlb2Sg5LVONH/nYb.yyBu7pPdsoRRG/kdJ0yniTFW','2022-08-30 11:08:57','1dc30069ac5d675593ba9492047ca249:c9fd0749546f73a4969f6b7c'),(10,'Akshay','Thadani','akshay-cip-admin',NULL,'srini@gmail.com','9873246721',4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2021-01-23 18:45:51','1','2021-01-23 18:45:51',NULL,'wwzasdqwe',1,NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
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
