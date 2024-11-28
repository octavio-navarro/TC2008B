import mysql from 'mysql2/promise';
import dotenv from 'dotenv/config';

class DatabaseController {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try{
      console.log("Connecting to database");
      this.connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      });
    }
    catch(error){
      console.error('Error connecting to database:', error);
    }
  }

  disconnect() {
    try{
        if(this.connection !== null){
            this.connection.end();
        }
    }
    catch(error){
        console.error('Error disconnecting from database:', error);
    }
    finally{
        console.log('Disconnected from database');
    }
  }
}

function validateAttempt(req, res){
 
  try{
    const attempt = req.body;

    let status = 200;
    let message = "Attempt is valid";
  
    if(attempt.year === undefined || attempt.classroom === undefined || attempt.name === undefined || attempt.current_cars === undefined || attempt.total_arrived===undefined){
      status = 400;
      message = "Missing parameters";
    }

    if(typeof attempt.year !== 'number' || typeof attempt.classroom !== 'number' || typeof attempt.name !== 'string' || typeof attempt.current_cars !== 'number' || typeof attempt.total_arrived !== 'number'){
      status = 400;
      message = "Invalid parameters";
    }

    res.status(status).json({message: message});

  }
  catch(error){
    console.error('Error validating attempt:', error);
    res.status(500).json({message: "Error validating attempt"});
  }
}

async function getAllAttempts(req, res){
    
    let databaseController = null;
  
    try{
      databaseController = new DatabaseController();
  
      await databaseController.connect();
  
      const query = `SELECT * FROM all_attempts` + (req.params.year !== undefined ? ` WHERE Team_year = ?` : '') + (req.params.classroom !== undefined ? ` AND Team_classroom = ?` : '');
  
      const params = [];
  
      if(req.params.year !== undefined){
        params.push(req.params.year);
      }
  
      if(req.params.classroom !== undefined){
        params.push(req.params.classroom);
      }
  
      const [results, fields] = await databaseController.connection.execute(query, params);
  
      res.status(200).json(results);
    }
    catch(error){
      console.error('Error getting all attempts:', error);
      res.status(500).json({message: "Error getting all attempts"});
    }
    finally{
      if(databaseController !== null){
        databaseController.disconnect();
      }
    }
}

async function getAverageAttempts(req, res){
    
    let databaseController = null;
  
    try{
      databaseController = new DatabaseController();
  
      await databaseController.connect();
  
      const query = `SELECT * FROM avg_attempts` + (req.params.year !== undefined ? ` WHERE year = ?` : '') + (req.params.classroom !== undefined ? ` AND classroom = ?` : '');
  
      const params = [];
  
      if(req.params.year !== undefined){
        params.push(req.params.year);
      }
  
      if(req.params.classroom !== undefined){
        params.push(req.params.classroom);
      }
  
      const [results, fields] = await databaseController.connection.execute(query, params);
  
      res.status(200).json(results);
    }
    catch(error){
      console.error('Error getting all attempts:', error);
      res.status(500).json({message: "Error getting all attempts"});
    }
    finally{
      if(databaseController !== null){
        databaseController.disconnect();
      }
    }
}

async function uploadAttempt(req, res){

  let databaseController = null;

  try{

    databaseController = new DatabaseController();

    await databaseController.connect();

    const attempt = req.body;

    // Obtain the first id from the teams table
    const [results_id, fields_id] = await databaseController.connection.execute(`SELECT team_id FROM Teams WHERE Team_year = ? and Team_classroom = ? and Team_name = ?`, [attempt.year, attempt.classroom, attempt.name]);

    let teamId = null;

    // If the team does not exist, create it
    if(results_id.length === 0){
      const [results, _] = await databaseController.connection.execute(`INSERT INTO Teams (Team_year, Team_classroom, Team_name) VALUES (?, ?, ?)`, [attempt.year, attempt.classroom, attempt.name]);

      // Get the id from the last inserted id
      teamId = results.insertId;
    }
    else{
      teamId = results_id[0].team_id;
    }

    // year, classroom, name, numcars
    const insertQuery = `INSERT INTO Attempts (Team_ID, attempt_current_cars, attempt_datetime, attempt_total_arrived) VALUES (?, ?, ?, ?)`;
    
    // Insert the attempt into the database

    const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    console.log(`Inserting values: ${teamId}, ${attempt.current_cars}, ${attempt.total_arrived} ${datetime}`)

    const [results_insert, fields_insert] = await databaseController.connection.execute(insertQuery, [teamId, attempt.current_cars,  datetime, attempt.total_arrived]);

    res.status(200).json({message: "Attempt uploaded successfully"});
  }
  catch(error){
    console.error('Error uploading attempt:', error);
    res.status(500).json({message: "Error uploading attempt"});
  }
  finally{
    if(databaseController !== null){
      databaseController.disconnect();
    }
  }
}

export {DatabaseController, uploadAttempt, getAllAttempts, validateAttempt, getAverageAttempts}
