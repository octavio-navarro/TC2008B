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
 1 AS `Year`,
 1 AS `Classroom`,
 1 AS `Team`,
 1 AS `Average current cars`,
 1 AS `Average total arrived`*/;
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
/*!50001 VIEW `avg_attempts` AS select `all_attempts`.`Team_year` AS `Year`,`all_attempts`.`Team_classroom` AS `Classroom`,`all_attempts`.`Team_name` AS `Team`,avg(`all_attempts`.`attempt_current_cars`) AS `Average current cars`,avg(`all_attempts`.`attempt_total_arrived`) AS `Average total arrived` from `all_attempts` group by `all_attempts`.`Team_year`,`all_attempts`.`Team_classroom`,`all_attempts`.`Team_name` order by `all_attempts`.`Team_year`,`all_attempts`.`Team_classroom`,`all_attempts`.`Team_name` */;
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

-- Dump completed on 2024-11-28  3:35:40
