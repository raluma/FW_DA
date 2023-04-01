import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { getUser, createUser, setUser, dropUser } from './DB/userQueries.js';
import { getEvents, getEvent, createEvent, setEvent, dropEvent } from './DB/eventQueries.js';

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
  const user = await getUser (
    req.query.login, 
    req.query.password
  );

  res.status(200).send(user);
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
    req.query.password,
    req.query.username, 
    req.query.email,
    req.query.newPassword
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
    req.query.password
  );

  if (existError(user)) {
    res.status(404).send(user);
  } else {
    res.status(200).send(user);
  }
})

app.post('/getEvents', async (req, res) => {
  const user = await getUser (
    req.query.login, 
    req.query.password
  );

  if (existError(user)) {
    res.status(404).send(user);
  } 
  else {
    const events = await getEvents(user.id);

    if (existError(events)) {
      res.status(404).send(events);
    } else {
      res.status(200).send(events);
    }
  }
})

app.post('/getEvent', async (req, res) => {
  const user = await getUser (
    req.query.login, 
    req.query.password
  );

  if (existError(user)) {
    res.status(404).send(user);
  } 
  else {
    const event = await getEvent (
      user.id,
      req.query.startDate, 
      req.query.startTime,
      req.query.endDate, 
      req.query.endTime,
      req.query.short_desc
    );

    if (existError(event)) {
      res.status(404).send(event);
    } else {
      res.status(200).send(event);
    }
  }
})

app.post('/createEvent', async (req, res) => {
  const user = await getUser (
    req.query.login, 
    req.query.password
  );

  if (existError(user)) {
    res.status(404).send(user);
  } 
  else {
    const tagsAdmin = [
      'exam'
    ]

    if (user.role !== 'admin' && tagsAdmin.includes(req.query.tag)) {
      res.status(404).send({"error": "No tiene permisos para crear ese tipo tarea."});
    } 
    else {
      const event = await createEvent (
        user.id,
        req.query.startDate, 
        req.query.startTime,
        req.query.endDate, 
        req.query.endTime,
        req.query.short_desc,
        req.query.desc,
        req.query.url_img,
        req.query.tag,
        req.query.url_doc,
        req.query.url_attachment
      );

      if (existError(event)) {
        res.status(404).send(event);
      } 
      else {
        res.status(200).send(event);
      }
    }
  }
})

app.post('/setEvent', async (req, res) => {
  const user = await getUser (
    req.query.login, 
    req.query.password
  );

  if (existError(user)) {
    res.status(404).send(user);
  } 
  else {
    const tagsAdmin = [
      'exam'
    ]

    if (user.role !== 'admin' && tagsAdmin.includes(req.query.tag)) {
      res.status(404).send({"error": "No tiene permisos para cambiar a ese tipo tarea."});
    } 
    else {
      const event = await setEvent (
        user.id,
        req.query.event_id,
        req.query.startDate, 
        req.query.startTime,
        req.query.endDate, 
        req.query.endTime,
        req.query.short_desc,
        req.query.desc,
        req.query.url_img,
        req.query.tag,
        req.query.url_doc,
        req.query.url_attachment
      );
      
      if (existError(event)) {
        res.status(404).send(event);
      } 
      else {
        res.status(200).send(event);
      }
    }
  }
})

app.post('/dropEvent', async (req, res) => {
  const user = await getUser (
    req.query.login, 
    req.query.password
  );

  if (existError(user)) {
    res.status(404).send(user);
  } 
  else {
    const event = await dropEvent (
      user.id,
      req.query.event_id,
      req.query.tag
    );
    
    if (existError(event)) {
      res.status(404).send(event);
    } 
    else {
      res.status(200).send(event);
    }
  }
})

app.listen(PORT, () => {
  console.log(`App Listening on port http://localhost:${PORT}`)
})
