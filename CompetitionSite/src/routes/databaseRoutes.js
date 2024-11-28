import express from 'express';
import * as databaseController from '../controllers/databaseController.js';
import apicache from 'apicache';

const cache = apicache.middleware;
const dbRouter = express.Router();

// Route to create a new record

// Route to get all records, with optional query parameters
dbRouter.get('/allAttempts',cache('2 minutes'), databaseController.getAllAttempts);

dbRouter.get('/allAttempts/:year/:classroom',cache('2 minutes'), databaseController.getAllAttempts);

dbRouter.get('/avgAttempts',cache('2 minutes'), databaseController.getAverageAttempts);

dbRouter.get('/avgAttempts/:year/:classroom',cache('2 minutes'), databaseController.getAverageAttempts);

dbRouter.post('/validate_attempt', databaseController.validateAttempt);

dbRouter.post('/attempt', databaseController.uploadAttempt);

export {dbRouter};
