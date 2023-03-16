import express from 'express';
import * as dotenv from 'dotenv';
import { sequelize, User } from "./DB/sequelize.js";

dotenv.config();
const app = express();

const { PORT } = process.env;

app.get('/', async (req, res) => {
    res.send(User === sequelize.models.User);
})

app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`)
})
