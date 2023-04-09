import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { createAdmin, getUser, createUser, setUser, dropUser } from './DB/userQueries.js';
import { 
  getEvents, getEvent, getTags, getTag, createTag, dropEvent, setDateEvent, 
  createExamEvent, setExamEvent, createWorkEvent, setWorkEvent, 
  createLeisureEvent, setLeisureEvent, createAppointmentEvent, setAppointmentEvent, 
} from './DB/eventQueries.js';

dotenv.config();
const app = express();

// createAdmin();
// createExamEvent(true, 1, "2023-04-06", "00:00", "2023-04-07", "00:00", "Examen", null, null, null, null);
// createWorkEvent(true, 1, "2023-04-06", "00:00", "2023-04-07", "00:00", "Trabajo", null, null, null, null, null);
// createLeisureEvent(1, "2023-04-06", "00:00", "2023-04-07", "00:00", "Ocio", null, null, null);
// createAppointmentEvent(1, "2023-04-06", "00:00", "2023-04-07", "00:00", "Cita", null, null, null, null);
// createTag("exam", "dodgerBlue", "Examen");
// createTag("work", "orange", "Trabajo");
// createTag("leisure", "violet", "Ocio");
// createTag("appointment", "green", "Cita");

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

app.get('/getTags', async (req, res) => {
  res.status(200).send(await getTags());
})

app.get('/getTag', async (req, res) => {
  res.status(200).send(await getTag(req.query.tagName))
})

app.post('/login', async (req, res) => {
  res.status(200).send(await getUser(req.query.login, req.query.password));  
})

app.post('/signup', async (req, res) => {
  res.status(200).send(await createUser(
    req.query.username, 
    req.query.email, 
    req.query.password
  ));
})

app.post('/setUser', async (req, res) => {
  res.status(200).send(await setUser(
    req.query.login,
    req.query.password,
    req.query.username, 
    req.query.email,
    req.query.newPassword
  ));
})

app.post('/dropUser', async (req, res) => {
  res.status(200).send(await dropUser(req.query.login, req.query.password));
})

app.post('/getEvents', async (req, res) => {
  const user = await getUser(req.query.login, req.query.password);

  if (existError(user)) {
    res.status(200).send(user);
  } 
  else {
    res.status(200).send(await getEvents(user.id));
  }
})

app.post('/getEvent', async (req, res) => {
  const user = await getUser(req.query.login, req.query.password);

  if (existError(user)) {
    res.status(200).send(user);
  } 
  else {
    res.status(200).send(await getEvent(req.query.event_id));
   }
})

app.post('/dropEvent', async (req, res) => {
  const user = await getUser (req.query.login, req.query.password);

  if (existError(user)) {
    res.status(200).send(user);
  } 
  else {
    res.status(200).send(await dropEvent(req.query.event_id, req.query.tag));
  }
})

app.post('/setDateEvent', async (req, res) => {
  const user = await getUser (
    req.query.login, 
    req.query.password
  );

  if (existError(user)) {
    res.status(200).send(user);
  } else {
    res.status(200).send(await setDateEvent (
      req.query.event_id,
      user.id,
      req.query.startDate, 
      req.query.startTime,
      req.query.endDate, 
      req.query.endTime
    ));
  }
})

app.post('/createExamEvent', async (req, res) => {
  const user = await getUser(req.query.login, req.query.password);

  if (existError(user)) {
    res.status(200).send(user);
  } 
  else {
    if (user.role !== 'admin') {
      res.status(200).send({"error": "No tiene permisos para crear ese tipo tarea."});
    } 
    else {
      const event = await createExamEvent (
        req.query.see_all,
        user.id,
        req.query.startDate, 
        req.query.startTime,
        req.query.endDate, 
        req.query.endTime,
        req.query.short_desc,
        req.query.desc,
        req.query.url_img,
        req.query.url_doc,
        req.query.url_exam
      );

      res.status(200).send(event);
    }
  }
})

app.post('/setExamEvent', async (req, res) => {
  const user = await getUser(req.query.login, req.query.password);

  if (existError(user)) {
    res.status(200).send(user);
  } 
  else {
    const exam = await setExamEvent(
      req.query.see_all,
      req.query.event_id,
      user.id,
      req.query.startDate, 
      req.query.startTime,
      req.query.endDate, 
      req.query.endTime,
      req.query.short_desc,
      req.query.desc,
      req.query.url_img,
      req.query.url_doc,
      req.query.url_exam
    );
    
    res.status(200).send(exam); 
  }
})

app.post('/createWorkEvent', async (req, res) => {
  const user = await getUser(req.query.login, req.query.password);

  if (existError(user)) {
    res.status(200).send(user);
  } 
  else {
    if (user.role !== 'admin') {
      res.status(200).send({"error": "No tiene permisos para crear ese tipo tarea."});
    } 
    else {
      const event = await createWorkEvent (
        req.query.see_all,
        user.id,
        req.query.startDate, 
        req.query.startTime,
        req.query.endDate, 
        req.query.endTime,
        req.query.short_desc,
        req.query.desc,
        req.query.url_img,
        req.query.url_doc,
        req.query.url_work
      );
      
      res.status(200).send(event);
    }
  }
})

app.post('/setWorkEvent', async (req, res) => {
  const user = await getUser (req.query.login, req.query.password);

  if (existError(user)) {
    res.status(200).send(user);
  } 
  else {
    const work = await setWorkEvent (
      req.query.see_all,
      req.query.event_id,
      user.id,
      req.query.startDate, 
      req.query.startTime,
      req.query.endDate, 
      req.query.endTime,
      req.query.short_desc,
      req.query.desc,
      req.query.url_img,
      req.query.url_doc,
      req.query.url_work
    );
    
    res.status(200).send(work);
  }
})

app.post('/createLeisureEvent', async (req, res) => {
  const user = await getUser(req.query.login, req.query.password);

  if (existError(user)) {
    res.status(200).send(user);
  } 
  else {
    const event = await createLeisureEvent (
      user.id,
      req.query.startDate, 
      req.query.startTime,
      req.query.endDate, 
      req.query.endTime,
      req.query.short_desc,
      req.query.desc,
      req.query.url_img,
      req.query.url_ticket
    );

    res.status(200).send(event);
  }
})

app.post('/setLeisureEvent', async (req, res) => {
  const user = await getUser(req.query.login, req.query.password);

  if (existError(user)) {
    res.status(200).send(user);
  } 
  else {
    const leisure = await setLeisureEvent (
      req.query.event_id,
      user.id,
      req.query.startDate, 
      req.query.startTime,
      req.query.endDate, 
      req.query.endTime,
      req.query.short_desc,
      req.query.desc,
      req.query.url_img,
      req.query.url_ticket
    );
      
    res.status(200).send(leisure);
  }
})

app.post('/createAppointmentEvent', async (req, res) => {
  const user = await getUser(req.query.login, req.query.password);

  if (existError(user)) {
    res.status(200).send(user);
  } 
  else {
    const event = await createAppointmentEvent (
      user.id,
      req.query.startDate, 
      req.query.startTime,
      req.query.endDate, 
      req.query.endTime,
      req.query.short_desc,
      req.query.desc,
      req.query.url_img,
      req.query.url_ticket,
      req.query.url_req
    );

    res.status(200).send(event);
  }
})

app.post('/setAppointmentEvent', async (req, res) => {
  const user = await getUser (
    req.query.login, 
    req.query.password
  );

  if (existError(user)) {
    res.status(200).send(user);
  } 
  else {
    const appointment = await setAppointmentEvent (
      req.query.event_id,
      user.id,
      req.query.startDate, 
      req.query.startTime,
      req.query.endDate, 
      req.query.endTime,
      req.query.short_desc,
      req.query.desc,
      req.query.url_img,
      req.query.url_ticket,
      req.query.url_req
    );
    
    res.status(200).send(appointment);
    
  }
})

app.listen(PORT, () => {
  console.log(`App Listening on port http://localhost:${PORT}`)
})
