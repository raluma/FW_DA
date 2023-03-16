import express from 'express';
import * as dotenv from 'dotenv';
import { getUser, setUser } from './DB/userQueries.js';

dotenv.config();
const app = express();

const { PORT } = process.env;

app.get('/', async (req, res) => {
  res.status(200).send("testing API");
})

app.post('/login', async (req, res) => {
  const user = await getUser(req.query.login, req.query.password);

  if (user === null) {
    res.status(404).send();
  } else {
    res.status(200).send();
  }
})

app.post('/signup', async (req, res) => {
  const user = await setUser (
    req.query.username, 
    req.query.email,
    req.query.password
  );

  if (user === false) {
    res.status(404).send();
  } else {
    res.status(200).send();
  }
})

app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`)
})
