import { Sequelize } from 'sequelize';
import { user, event, exam, work, leisure, appointment } from './models.js';
import * as dotenv from 'dotenv';

dotenv.config();

const { DIALECT, HOST, USERNAME, PASSWORD, DATABASE } = process.env;

export const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
    host: HOST,
    dialect: DIALECT,
    logging: false
});

export const User = sequelize.define('User', user);
export const Event = sequelize.define('Event', event);
export const Exam = sequelize.define('Exam', exam);
export const Work = sequelize.define('Work', work);
export const Leisure = sequelize.define('Leisure', leisure);
export const Appointment = sequelize.define('Appointment', appointment);

await User.sync({ alter: true });
await Event.sync({ alter: true });
await Exam.sync({ alter: true });
await Work.sync({ alter: true });
await Leisure.sync({ alter: true });
await Appointment.sync({ alter: true });

