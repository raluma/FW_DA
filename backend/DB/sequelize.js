import { Sequelize } from 'sequelize';
import { sequelize, user, event, exam } from './models';
import * as dotenv from 'dotenv';

dotenv.config();

const { DIALECT, HOST, USERNAME, PASSWORD, DATABASE } = process.env;

export const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
    host: HOST,
    dialect: DIALECT,
    login: true
});

export const User = sequelize.define('User', user);
export const Event = sequelize.define('Event', event);
export const Exam = sequelize.define('Exam', exam);

