import dotenv from 'dotenv';

dotenv.config();

interface DevelopmentInterface {
  database: string;
  username: string;
  password: string;
  host: string;
  dialect: string;
  [key: string]: any;
}
interface ConfigInterface {
  development: DevelopmentInterface;
  [key: string]: any;
}
const config: ConfigInterface = {
  development: {
    database: process.env.DB_NAME ?? '',
    username: process.env.DB_USER ?? '',
    password: process.env.DB_PASS ?? '',
    host: process.env.DB_HOST ?? '',
    dialect: 'postgres',
  },
  production: {
    database: process.env.DB_NAME ?? '',
    username: process.env.DB_USER ?? '',
    password: process.env.DB_PASS ?? '',
    host: process.env.DB_HOST ?? '',
    dialect: 'postgres',
  },
};

export default config;
