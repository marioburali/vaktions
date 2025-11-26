import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

// Aqui está a instância do Sequelize, que será usada por todos os models
const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USERNAME as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres',
    logging: false,
  }
);
export default sequelize;
