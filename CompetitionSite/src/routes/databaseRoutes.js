import express from 'express';
import databaseController from '../controllers/databaseController.js';

const dbRouter = express.Router();

// Route to get all records from the database
dbRouter.get('/records', databaseController.getAllRecords);

// Route to get a specific record by ID
dbRouter.get('/records/:id', databaseController.getRecordById);

// Route to create a new record
dbRouter.post('/records', databaseController.createRecord);

// Route to update an existing record
dbRouter.put('/records/:id', databaseController.updateRecord);

// Route to delete a record
dbRouter.delete('/records/:id', databaseController.deleteRecord);

export default dbRouter;
