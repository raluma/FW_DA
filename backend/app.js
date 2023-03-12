import express from 'express';
import * as dotenv from 'dotenv';
import sequelize from "./db/connection.js";

dotenv.config();
const app = express();

const { PORT } = process.env;

app.get('/', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.send('Connection has been established successfully.');
  } catch (error) {
    res.send(`Unable to connect to the database: ${error.message}`);
  }
})

app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`)
})
