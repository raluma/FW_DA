import express from 'express';
import * as dotenv from 'dotenv';
import { getUser, createUser } from './DB/userQueries.js';
import { getEvents, getEvent } from './DB/eventQueries.js';

dotenv.config();
const app = express();

const { PORT } = process.env;

const existError = (obj) => {
  return obj instanceof Object && obj['error'] !== undefined;
}

app.get('/', async (req, res) => {
  res.status(200).send("testing API");
})

app.post('/login', async (req, res) => {
  const user = await getUser(req.query.login, req.query.password);

  if (existError(user)) {
    res.status(404).send(user);
  } else {
    res.status(200).send(user);
  }
})

app.post('/signup', async (req, res) => {
  const user = await createUser (
    req.query.username, 
    req.query.email,
    req.query.password
  );

  if (existError(user)) {
    res.status(404).send(user);
  } else {
    res.status(200).send();
  }
})

app.post('/getEvents', async (req, res) => {
  const events = await getEvents(req.query.id);

  if (existError(events)) {
    res.status(404).send(events);
  } else {
    res.status(200).send(events);
  }
})

app.post('/getEvent', async (req, res) => {
  const event = await getEvent (
    req.query.date, 
    req.query.time,
    req.query.short_desc,
    req.query.user_id
  );

  if (existError(event)) {
    res.status(404).send(event);
  } else {
    res.status(200).send(event);
  }
})

app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`)
})
