import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { getUser, createUser, setUser, dropUser } from './DB/userQueries.js';
import { getEvents, getEvent, createEvent, setEvent } from './DB/eventQueries.js';

dotenv.config();
const app = express();

const { PORT, AUTH_WEB } = process.env;

app.use(cors({
  origin: AUTH_WEB
}));

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
    res.status(200).send(user);
  }
})

app.post('/setUser', async (req, res) => {
  const user = await setUser (
    req.query.login,
    req.query.username, 
    req.query.email,
    req.query.password
  );

  if (existError(user)) {
    res.status(404).send(user);
  } else {
    res.status(200).send(user);
  }
})

app.post('/dropUser', async (req, res) => {
  const user = await dropUser (
    req.query.login,
  );

  if (existError(user)) {
    res.status(404).send(user);
  } else {
    res.status(200).send(user);
  }
})

app.post('/getEvents', async (req, res) => {
  const events = await getEvents(req.query.user_id);

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

app.post('/createEvent', async (req, res) => {
  const event = await createEvent (
    req.query.date, 
    req.query.time,
    req.query.short_desc,
    req.query.desc,
    req.query.url_img,
    req.query.tag,
    req.query.user_id,
    req.query.url_doc,
    req.query.url_attachment
  );

  if (existError(event)) {
    res.status(404).send(event);
  } else {
    res.status(200).send(event);
  }
})

app.post('/setEvent', async (req, res) => {
  const event = await setEvent (
    req.query.event_id,
    req.query.date, 
    req.query.time,
    req.query.short_desc,
    req.query.desc,
    req.query.url_img,
    req.query.tag,
    req.query.user_id,
    req.query.url_doc,
    req.query.url_attachment
  );

  if (existError(event)) {
    res.status(404).send(event);
  } else {
    res.status(200).send(event);
  }
})

app.listen(PORT, () => {
  console.log(`App Listening on port http://localhost:${PORT}`)
})
