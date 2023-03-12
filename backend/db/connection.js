import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

const { DIALECT, HOST, USERNAME, PASSWORD, DATABASE } = process.env;

const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
    host: HOST,
    dialect: DIALECT,
    login: true
});

export default sequelize;