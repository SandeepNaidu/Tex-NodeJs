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
-- Table structure for table `policies_components`
--

DROP TABLE IF EXISTS `policies_components`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `policies_components` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `policyId` int(10) unsigned NOT NULL,
  `componentId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `policyTableId_idx` (`policyId`),
  KEY `componentId_idx` (`componentId`),
  CONSTRAINT `componentId` FOREIGN KEY (`componentId`) REFERENCES `components` (`id`),
  CONSTRAINT `policyTableId` FOREIGN KEY (`policyId`) REFERENCES `policies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1305 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `policies_components`
--

LOCK TABLES `policies_components` WRITE;
/*!40000 ALTER TABLE `policies_components` DISABLE KEYS */;
INSERT INTO `policies_components` VALUES (127,2,3),(128,2,5),(129,2,58),(130,28,1),(131,28,2),(132,28,3),(133,28,4),(134,28,5),(135,28,58),(136,28,11),(371,3,5),(413,30,63),(414,1,1),(415,1,2),(416,31,58),(417,32,1),(418,33,1),(419,33,3),(422,35,2),(423,36,1),(424,36,61),(427,37,1),(428,37,2),(429,37,61),(623,38,3),(624,38,2),(625,38,4),(626,38,5),(627,38,78),(628,38,74),(629,38,73),(630,38,71),(631,38,70),(632,38,69),(633,38,68),(634,38,67),(635,38,62),(636,38,61),(803,34,2),(804,34,67),(805,34,68),(806,34,70),(807,34,4),(808,34,71),(809,34,72),(810,34,73),(811,34,74),(812,34,75),(813,34,78),(814,34,79),(815,34,1),(816,34,88),(817,39,2),(818,39,79),(819,39,78),(820,39,74),(821,39,73),(822,39,71),(823,39,4),(824,39,68),(825,39,67),(826,39,70),(827,39,1),(828,39,88),(829,42,91),(830,43,92),(831,43,93),(1092,45,94),(1093,45,93),(1094,45,92),(1095,45,1),(1096,45,2),(1097,45,3),(1222,41,82),(1223,41,84),(1238,40,83),(1239,40,87),(1240,40,86),(1241,40,85),(1242,40,84),(1243,40,82),(1244,40,81),(1257,4,3),(1258,4,4),(1259,4,6),(1260,4,61),(1261,4,62),(1262,4,1),(1263,4,5),(1264,4,2),(1265,4,11),(1266,4,58),(1267,4,74),(1268,47,95),(1280,44,1),(1281,44,2),(1282,44,4),(1283,44,71),(1284,44,88),(1285,44,68),(1286,44,73),(1287,44,74),(1288,44,70),(1289,44,67),(1290,44,79),(1291,44,78),(1292,29,1),(1293,29,2),(1294,29,11),(1295,29,58),(1296,29,61),(1297,29,62),(1298,29,3),(1299,29,4),(1300,29,5),(1301,29,6),(1302,29,69),(1303,29,95),(1304,48,1);
/*!40000 ALTER TABLE `policies_components` ENABLE KEYS */;
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

-- Dump completed on 2022-09-06  9:39:27
