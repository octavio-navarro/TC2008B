"use strict";

import express from "express";
import cors from "cors";
import dotenv from "dotenv/config";
import ratelimit from "express-rate-limit";
import fs from "fs";

import dbRouter from "./src/routes/databaseRoutes"; 

// Middleware
app.use(express.json());
app.use(cors);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const limiter = ratelimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
});

const app = express();
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
