CREATE DATABASE  IF NOT EXISTS `TC2008B_Contest` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `TC2008B_Contest`;
-- MySQL dump 10.13  Distrib 8.0.35, for Linux (x86_64)
--
-- Host: localhost    Database: TC2008B_Contest
-- ------------------------------------------------------
-- Server version	8.0.35

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

--
-- Table structure for table `Attempts`
--

DROP TABLE IF EXISTS `Attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Attempts` (
  `Attempt_ID` int NOT NULL AUTO_INCREMENT,
  `Team_ID` int NOT NULL,
  `Attempt_current_cars` int NOT NULL,
  `Attempt_datetime` datetime NOT NULL,
  `Attempt_total_arrived` int NOT NULL,
  PRIMARY KEY (`Attempt_ID`),
  UNIQUE KEY `Attempts_ID_UNIQUE` (`Attempt_ID`),
  KEY `fk_Attempts_1_idx` (`Team_ID`),
  CONSTRAINT `fk_Attempts_1` FOREIGN KEY (`Team_ID`) REFERENCES `Teams` (`Team_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Attempts`
--

LOCK TABLES `Attempts` WRITE;
/*!40000 ALTER TABLE `Attempts` DISABLE KEYS */;
INSERT INTO `Attempts` VALUES (1,1,50,'2023-11-29 05:59:27',0),(2,1,50,'2023-11-29 05:59:39',0),(3,1,50,'2023-11-29 06:01:25',0),(4,1,50,'2023-11-29 06:02:51',0),(5,1,50,'2023-11-29 06:03:33',0),(6,2,50,'2023-11-29 06:03:41',0),(7,2,50,'2023-11-29 06:05:08',0),(8,3,50,'2023-11-29 06:30:31',0),(9,4,50,'2023-11-29 06:32:42',0),(10,5,3,'2023-11-30 08:36:22',0),(11,6,50,'2024-11-28 09:12:16',10),(12,6,50,'2024-11-28 09:14:32',10),(13,6,60,'2024-11-28 09:16:53',10),(14,6,60,'2024-11-28 09:18:32',15),(15,6,60,'2024-11-28 09:18:35',16),(16,6,60,'2024-11-28 09:25:53',11);
/*!40000 ALTER TABLE `Attempts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Teams`
--

DROP TABLE IF EXISTS `Teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Teams` (
  `Team_ID` int NOT NULL AUTO_INCREMENT,
  `Team_year` int NOT NULL,
  `Team_classroom` int NOT NULL,
  `Team_name` varchar(45) NOT NULL,
  PRIMARY KEY (`Team_ID`),
  UNIQUE KEY `Team_ID_UNIQUE` (`Team_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Teams`
--

LOCK TABLES `Teams` WRITE;
/*!40000 ALTER TABLE `Teams` DISABLE KEYS */;
INSERT INTO `Teams` VALUES (1,2023,301,'Equipo0'),(2,2023,301,'Equipo1'),(3,2023,302,'Equipo1'),(4,2023,302,'Equipo2'),(5,2023,301,'Equipo2'),(6,2024,301,'bal');
/*!40000 ALTER TABLE `Teams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `all_attempts`
--

DROP TABLE IF EXISTS `all_attempts`;
/*!50001 DROP VIEW IF EXISTS `all_attempts`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `all_attempts` AS SELECT 
 1 AS `Team_year`,
 1 AS `Team_classroom`,
 1 AS `Team_name`,
 1 AS `attempt_current_cars`,
 1 AS `attempt_datetime`,
 1 AS `attempt_total_arrived`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `avg_attempts`
--

DROP TABLE IF EXISTS `avg_attempts`;
/*!50001 DROP VIEW IF EXISTS `avg_attempts`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `avg_attempts` AS SELECT 
 1 AS `Team_year`,
 1 AS `Team_classroom`,
 1 AS `Team_name`,
 1 AS `attempt_current_cars`,
 1 AS `attempt_total_arrived`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `all_attempts`
--

/*!50001 DROP VIEW IF EXISTS `all_attempts`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `all_attempts` AS select `t`.`Team_year` AS `Team_year`,`t`.`Team_classroom` AS `Team_classroom`,`t`.`Team_name` AS `Team_name`,`a`.`Attempt_current_cars` AS `attempt_current_cars`,`a`.`Attempt_datetime` AS `attempt_datetime`,`a`.`Attempt_total_arrived` AS `attempt_total_arrived` from (`Teams` `t` join `Attempts` `a` on((`t`.`Team_ID` = `a`.`Team_ID`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `avg_attempts`
--

/*!50001 DROP VIEW IF EXISTS `avg_attempts`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `avg_attempts` AS select `all_attempts`.`Team_year` AS `Team_year`,`all_attempts`.`Team_classroom` AS `Team_classroom`,`all_attempts`.`Team_name` AS `Team_name`,max(`all_attempts`.`attempt_current_cars`) AS `attempt_current_cars`,max(`all_attempts`.`attempt_total_arrived`) AS `attempt_total_arrived` from `all_attempts` group by `all_attempts`.`Team_year`,`all_attempts`.`Team_classroom`,`all_attempts`.`Team_name` order by `all_attempts`.`Team_year`,`all_attempts`.`Team_classroom`,`all_attempts`.`Team_name` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-28 12:17:59
