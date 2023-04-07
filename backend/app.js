import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import {createAdmin, getUser, createUser, setUser, dropUser } from './DB/userQueries.js';
import { 
  getEvents, getEvent, getTags, getTag, createTag, dropEvent, setDateEvent, 
  createExamEvent, setExamEvent, createWorkEvent, setWorkEvent, 
  createLeisureEvent, setLeisureEvent, createAppointmentEvent, setAppointmentEvent, 
} from './DB/eventQueries.js';

dotenv.config();
const app = express();

// createAdmin();
// createExamEvent(1, "2023-04-06", "0:0", "2023-04-07", "0:0", "Examen", null, null, null, null);
// createWorkEvent(1, "2023-04-06", "0:0", "2023-04-07", "0:0", "Trabajo", null, null, null, null, null);
// createLeisureEvent(1, "2023-04-06", "0:0", "2023-04-07", "0:0", "Ocio", null, null, null);
// createAppointmentEvent(1, "2023-04-06", "0:0", "2023-04-07", "0:0", "Cita", null, null, null, null);
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
  const tags = await getTags();

  if (existError(tags)) {
    res.status(404).send(tags);
  } 
  else {
    res.status(200).send(tags);
  }
})

app.get('/getTag', async (req, res) => {
  const tag = await getTag ( 
    req.query.tagName
  );

  if (existError(tag)) {
    res.status(404).send(tag);
  } 
  else {
    res.status(200).send(tag)
  }
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

app.post('/setDateEvent', async (req, res) => {
  const user = await getUser (
    req.query.login, 
    req.query.password
  );

  if (existError(user)) {
    res.status(404).send(user);
  } 
  else {
    const event = await setDateEvent (
      req.query.event_id,
      req.query.startDate, 
      req.query.startTime,
      req.query.endDate, 
      req.query.endTime
    );
    
    if (existError(event)) {
      res.status(404).send(event);
    } 
    else {
      res.status(200).send(event);
    }
  }
})

app.post('/createExamEvent', async (req, res) => {
  const user = await getUser (
    req.query.login, 
    req.query.password
  );

  if (existError(user)) {
    res.status(404).send(user);
  } 
  else {
    if (user.role !== 'admin') {
      res.status(404).send({"error": "No tiene permisos para crear ese tipo tarea."});
    } 
    else {
      const event = await createExamEvent (
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

      if (existError(event)) {
        res.status(404).send(event);
      } 
      else {
        res.status(200).send(event);
      }
    }
  }
})

app.post('/setExamEvent', async (req, res) => {
  const user = await getUser (
    req.query.login, 
    req.query.password
  );

  if (existError(user)) {
    res.status(404).send(user);
  } 
  else {
    if (user.role !== 'admin') {
      res.status(404).send({"error": "No tiene permisos para cambiar a ese tipo tarea."});
    } 
    else {
      const event = await setExamEvent (
        req.query.event_id,
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
      
      if (existError(event)) {
        res.status(404).send(event);
      } 
      else {
        res.status(200).send(event);
      }
    }
  }
})

app.post('/createWorkEvent', async (req, res) => {
  const user = await getUser (
    req.query.login, 
    req.query.password
  );

  if (existError(user)) {
    res.status(404).send(user);
  } 
  else {
    if (user.role !== 'admin') {
      res.status(404).send({"error": "No tiene permisos para crear ese tipo tarea."});
    } 
    else {
      const event = await createWorkEvent (
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

      if (existError(event)) {
        res.status(404).send(event);
      } 
      else {
        res.status(200).send(event);
      }
    }
  }
})

app.post('/setWorkEvent', async (req, res) => {
  const user = await getUser (
    req.query.login, 
    req.query.password
  );

  if (existError(user)) {
    res.status(404).send(user);
  } 
  else {
    if (user.role !== 'admin') {
      res.status(404).send({"error": "No tiene permisos para cambiar a ese tipo tarea."});
    } 
    else {
      const event = await setWorkEvent (
        req.query.event_id,
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
      
      if (existError(event)) {
        res.status(404).send(event);
      } 
      else {
        res.status(200).send(event);
      }
    }
  }
})

app.post('/createLeisureEvent', async (req, res) => {
  const user = await getUser (
    req.query.login, 
    req.query.password
  );

  if (existError(user)) {
    res.status(404).send(user);
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

    if (existError(event)) {
      res.status(404).send(event);
    } 
    else {
      res.status(200).send(event);
    }
  }
})

app.post('/setLeisureEvent', async (req, res) => {
  const user = await getUser (
    req.query.login, 
    req.query.password
  );

  if (existError(user)) {
    res.status(404).send(user);
  } 
  else {
    const event = await setLeisureEvent (
      req.query.event_id,
      req.query.startDate, 
      req.query.startTime,
      req.query.endDate, 
      req.query.endTime,
      req.query.short_desc,
      req.query.desc,
      req.query.url_img,
      req.query.url_ticket
    );
    
    if (existError(event)) {
      res.status(404).send(event);
    } 
    else {
      res.status(200).send(event);
    }
  }
})

app.post('/createAppointmentEvent', async (req, res) => {
  const user = await getUser (
    req.query.login, 
    req.query.password
  );

  if (existError(user)) {
    res.status(404).send(user);
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

    if (existError(event)) {
      res.status(404).send(event);
    } 
    else {
      res.status(200).send(event);
    }
  }
})

app.post('/setAppointmentEvent', async (req, res) => {
  const user = await getUser (
    req.query.login, 
    req.query.password
  );

  if (existError(user)) {
    res.status(404).send(user);
  } 
  else {
    const event = await setAppointmentEvent (
      req.query.event_id,
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
