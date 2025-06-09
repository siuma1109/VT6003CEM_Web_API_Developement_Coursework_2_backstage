import { importModels, Sequelize } from '@sequelize/core';
import config from '../configs/database.config';
import { PostgresDialect } from '@sequelize/postgres';

// Create and export the Sequelize instance for the application
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = async () => new Sequelize({
  dialect: PostgresDialect,
  database: dbConfig.database!,
  user: dbConfig.username!,
  password: dbConfig.password!,
  host: dbConfig.host!,
  port: dbConfig.port!,
  ssl: false,
  clientMinMessages: 'notice',
  models: await importModels(__dirname + '/*.model.ts')
});

export default sequelize;