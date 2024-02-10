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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `firstName` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `lastName` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `username` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(5000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '',
  `email` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `contactNumber` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `roleId` int unsigned NOT NULL,
  `parentUserId` int DEFAULT NULL,
  `agencyId` int DEFAULT NULL,
  `agencyPIC` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `reportingManager` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `reportingManagerEmail` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `reportingLocation` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `resourceType` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `employeeId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `loginTime` time DEFAULT NULL,
  `logoutTime` time DEFAULT NULL,
  `isActive` int NOT NULL DEFAULT '1',
  `isDeleted` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'N',
  `userDeletedAt` datetime DEFAULT NULL,
  `creationDate` datetime NOT NULL,
  `createdBy` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `updationDate` datetime NOT NULL,
  `updatedBy` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `notes` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `forceReset` tinyint DEFAULT '0',
  `verifyCode` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `verifyCodeExp` datetime DEFAULT NULL,
  `encryptedPassword` varchar(5000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `gender` enum('Male','Female') NOT NULL,
  `dob` date DEFAULT NULL,
  `age` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `unique_username` (`username`),
  KEY `roleIdKey_idx` (`roleId`),
  KEY `username_idx` (`username`),
  CONSTRAINT `roleIdKey` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1404 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Super','Admin','superadmin','$2a$10$VBgoPZpLvRd/.VDFMdnEkOoa.eHOGkwxq.A/9SHQnZnhc6ZvVjPtC','srini@gmail.com','6012312312',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2021-01-05 10:45:30','1','2021-01-05 10:45:30',NULL,'-',0,'$2a$10$5nJ0H85QJR1xIlb2Sg5LVONH/nYb.yyBu7pPdsoRRG/kdJ0yniTFW','2022-08-30 11:08:57','1dc30069ac5d675593ba9492047ca249:c9fd0749546f73a4969f6b7c','Male',NULL,NULL),(1362,'tyyyy','ytu','rty','$2a$10$bOHaDWDwEcy2avXPN5OIFePPyKev6wAWRFqS/YITrFoSStaY33XJi','uyii@est.com','7666',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-10-20 14:52:58','superadmin','2022-10-20 14:52:58','superadmin','ertyu',1,NULL,NULL,NULL,'Male',NULL,NULL),(1363,'ting','tong','test','$2a$10$DDQPlqyuTHLzeqHmWy2bxe7AS7Xx5IyIux8EVWaAznxzmoyqeRRnW','test@test.com','123456',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-10-20 14:58:43','superadmin','2022-10-20 14:58:43','superadmin','ertyu',1,NULL,NULL,NULL,'Male',NULL,NULL),(1364,'su','re','suresh','$2a$10$HBMjhSRs8coFfxBjGxkt4.ye/Xx/NNmcvlwtZXc7IGohCBmNNLLkO','su@re.com','675435',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-10-20 15:00:16','superadmin','2022-10-20 15:00:16','superadmin','-',0,NULL,NULL,NULL,'Male',NULL,NULL),(1365,'abc','pmo','xyz','$2a$10$xFVeE.LZVy7r/4d3RODYJu4as131Vb0l9LGoLKnuJZnsTr5kVLg6i','pmo@abc.com','564312',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-10-20 18:53:50','superadmin','2022-10-20 18:53:50','superadmin','-',1,NULL,NULL,NULL,'Male',NULL,NULL),(1367,'tex_123','tex#123','abc','$2a$10$nmLAP5RwYR/mKw0VYCFcpO1h5a2OAai3Iu8u/HGaPvAiYDKEa.eRa','pmo@abc.com','333333333',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-10-20 18:58:48','superadmin','2022-11-16 12:40:28','superadmin','ertyuvvvv',1,NULL,NULL,NULL,'Female','2000-04-09',40),(1369,'xyzqq','pmo','abcqq','$2a$10$7xgpnVv1cJJFs/oipvVR0eJlmEUvToo88z7SFku09YW.A4AcJkD6C','pmo@abc.com','564312',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-10-20 20:29:47','superadmin','2022-10-20 20:29:47','superadmin','ertyu',1,NULL,NULL,NULL,'Male',NULL,NULL),(1370,'ggg','pmo','ttt','$2a$10$dIrH2WGyiZ4lJzQWwEiv8ONuyGywFKPjiFhRDNZSIWATcRhqncagK','tt@gg.com','6666666',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-10-21 01:17:53','superadmin','2022-10-21 01:17:53','superadmin','ertyu',1,NULL,NULL,NULL,'Female','0000-00-00',32),(1371,'bbbbbbb','pmo','aaaaaa','$2a$10$pxVIuvL6H2ihKsVo4m3iseiMdvkY0I4iiARXM3Z8lrQZ6bCVWVdLq','aaa@bbbb.com','7777',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-10-21 01:24:17','superadmin','2022-10-21 01:24:17','superadmin','ertyu',1,NULL,NULL,NULL,'Female','1990-01-01',32),(1372,'fff','vvv','ddd','$2a$10$kOvpHAR92Z6HHZVSR7/5cegoxDXyI4/.Fh0wJJUKzTWm5TDPEftPe','ddd@fff.com','7777',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-10-21 01:26:12','superadmin','2022-10-21 01:26:12','superadmin','ertyu',1,NULL,NULL,NULL,'Female','1990-04-09',37),(1373,'jjj','kkk','yyy','$2a$10$Y0Zm4O00CebDAtdSeO1a9eAwnv6CGGEYkIikYSih9utSILJ0Usqzi','hh@kk.com','7777',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-10-21 01:27:08','superadmin','2022-10-21 01:27:08','superadmin','ertyu',1,NULL,NULL,NULL,'Male','1990-01-01',0),(1374,'s','chand','john','$2a$10$KA7R9Ueaxv3Jxr25MlAjSurJY7jt1G8Nu1tDi3Byl7St4yROJ7Wr6','john@test.com','524893547',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-10-21 01:34:51','superadmin','2022-10-21 01:34:51','superadmin','aaja',0,NULL,NULL,NULL,'Male','1990-01-01',0),(1375,'mika','kapil','ivan','$2a$10$.d4HbjWFbexUGqF7LA7Q5.yLOTaFMRIkrmQtJAlpsIl0DUbJplW4O','kapil@s.com','333333333',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-10-21 01:39:46','superadmin','2022-10-21 01:39:46','superadmin','ertyu',1,NULL,NULL,NULL,'Female','2000-04-09',40),(1376,'na','pu','vas','$2a$10$TX2RqbTNhuwUAV9gORZU6eHwPR5qlreO5A6hiv3Vxbgi39A/FP196','ri@kar.com','7987546541',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-10-21 19:14:59','superadmin','2022-10-21 19:14:59','superadmin','-',0,NULL,NULL,NULL,'Male','1990-01-01',0),(1377,'y','xx','zed','$2a$10$NdPe2eFa13Vpd13zTXfsXOEcliX0AnHe8t4F4rwNNQugB8q3R/T3C','tmk@gmail.com','2154684531658',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-10-21 21:08:50','superadmin','2022-10-21 21:08:50','superadmin','ttrt',0,NULL,NULL,NULL,'Male','1990-01-01',0),(1379,'ahh','jjkhj','demq','$2a$10$gc56Dt5jgyfKuWHy4U5dnOCOmId7sYbC4jxnjt7ZclnANOtWK0LaG','demqert@ghhgs.com','892231212',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-10-23 23:22:55','superadmin','2022-10-23 23:22:55','superadmin','-',1,NULL,NULL,NULL,'Male','1990-01-01',0),(1380,'ghjhjh','jkhjk','zawe','$2a$10$ia8Ce2GVplcZIMVcGaJy3u4KGj0LkfNhxSWMc2B3.dtdcLnVhlKQW','weghjg@gmail.com','012102122',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-10-23 23:24:24','superadmin','2022-10-23 23:24:24','superadmin','-',1,NULL,NULL,NULL,'Male','1990-01-01',0),(1381,'testlb1','asdf','testlab','$2a$10$6PpOsVW4TEO1HXoqd5hgCuL2sADYZ4vGi9um/XXg3f.wGF76HJUp6','testlab@gmail.com','6398721004',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-10-25 21:55:45','superadmin','2022-10-25 21:55:45','superadmin','-',1,NULL,NULL,NULL,'Male','1990-01-01',0),(1384,'abc_123','abc#123','test123','0000','test123@s.com','7777777777',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-10-26 10:20:16','test123','2022-11-16 13:39:23','test123','ertyu',0,NULL,NULL,NULL,'Male','2020-04-09',20),(1386,'ammit_123','panday','amit','0000','amit@test.com','333333333',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-10-26 12:32:16','amit','2022-10-26 12:32:16','amit','amitote',0,NULL,NULL,NULL,'','2000-04-09',30),(1388,'Abhilash','','9899066865','0000','','9899066865',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-10-27 13:50:47','9899066865','2022-10-27 13:50:47','9899066865','-',0,NULL,NULL,NULL,'Male','1990-01-01',0),(1391,'abjadsd','','abhi@gmail.com','0000','','abhi@gmail.com',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-10-27 16:03:58','abhi@gmail.com','2022-10-27 16:03:58','abhi@gmail.com','-',0,NULL,NULL,NULL,'Male','1990-01-01',0),(1392,'abhilash','','9899066866','0000','','9899066866',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-10-27 16:12:45','9899066866','2022-10-27 16:12:45','9899066866','-',0,NULL,NULL,NULL,'Male','1990-01-01',0),(1393,'abhilash','','9899066867','0000','','9899066867',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-10-27 19:49:48','9899066867','2022-10-27 19:49:48','9899066867','-',0,NULL,NULL,NULL,'Male','1990-01-01',0),(1394,'kkjlj','','0800809879','0000','','0800809879',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-10-27 21:18:53','0800809879','2022-10-27 21:18:53','0800809879','-',0,NULL,NULL,NULL,'Male','1990-01-01',0),(1395,'kladjad','','abhi1@gmail.com','0000','','abhi1@gmail.com',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-10-27 21:25:44','abhi1@gmail.com','2022-10-27 21:25:44','abhi1@gmail.com','-',0,NULL,NULL,NULL,'Male','1990-01-01',0),(1396,'abhilasjh','','98990666853','0000','','98990666853',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-10-27 22:53:25','98990666853','2022-10-27 22:53:25','98990666853','-',0,NULL,NULL,NULL,'Male','1990-01-01',0),(1397,'Offhigh','','offgd@gmail.com','0000','','Offgd@gmail.Com',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-10-27 23:19:51','Offgd@gmail.Com','2022-10-27 23:19:51','Offgd@gmail.Com','-',0,NULL,NULL,NULL,'Male','1990-01-01',0),(1398,'Abhilash','','9899066855','0000','','9899066855',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-10-27 23:54:23','9899066855','2022-10-27 23:54:23','9899066855','-',0,NULL,NULL,NULL,'Male','1990-01-01',0),(1399,'asdasfd','','312123123123','0000','','312123123123',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-10-29 02:54:43','312123123123','2022-10-29 02:54:43','312123123123','-',0,NULL,NULL,NULL,'Male','1990-01-01',0),(1400,'Ravindra ','','uiplus89@gmail.com','0000','','uiplus89@gmail.',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-11-09 21:15:31','uiplus89@gmail.com','2022-11-09 21:15:31','uiplus89@gmail.com','-',0,NULL,NULL,NULL,'Male','1990-01-01',0),(1401,'recruiter','','7982877132','0000','','7982877132',122,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-11-14 16:48:01','7982877132','2022-11-14 16:48:01','7982877132','-',0,NULL,NULL,NULL,'Male','1990-01-01',0),(1402,'tex_123','tex#123','text123','0000','tex123@s.com','333333333',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-11-15 16:29:12','text123','2022-11-15 16:29:12','text123','ertyu',0,NULL,NULL,NULL,'Female','2000-04-09',40),(1403,'mikaa','kapila','ivana','$2a$10$.2.ESFmpOSPbahTPfj3gQ.pmfHCDYyXYaTP/13hV/8E89sRaEq8OO','kapila@s.com','333333333',121,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'N',NULL,'2022-11-15 16:53:21','superadmin','2022-11-15 16:53:21','superadmin','ertyu',1,NULL,NULL,NULL,'Female','2000-04-09',40);
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

-- Dump completed on 2022-11-18 14:50:51
