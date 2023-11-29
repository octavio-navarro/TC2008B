import express from 'express';
import * as databaseController from '../controllers/databaseController.js';

const dbRouter = express.Router();

// Route to create a new record

// Route to get all records, with optional query parameters
dbRouter.get('/attempts', databaseController.getAllAttempts);

dbRouter.get('/attempts/:year/:classroom', databaseController.getAllAttempts);

dbRouter.post('/validate_attempt', databaseController.validateAttempt);

dbRouter.post('/attempts', databaseController.uploadAttempt);

export {dbRouter};
