import { Sequelize } from 'sequelize';
import { user, event, exam } from './models.js';
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

await User.sync({ alter: true });
await Event.sync({ alter: true });
await Exam.sync({ alter: true });

