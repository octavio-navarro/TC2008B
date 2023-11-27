import mysql from 'mysql2/promise';
import dotenv from 'dotenv/config';

class DatabaseController {
  constructor() {
    this.connection = null;
  }

  async createConnection() { 
    return await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
  }

  connect() {
    this.connection.connect((err) => {
      if (err) {
        console.error('Error connecting to database:', err);
      } else {
        console.log('Connected to database');
      }
    });
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

export default DatabaseController;
