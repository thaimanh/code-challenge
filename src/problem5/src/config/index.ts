import dotenv from 'dotenv';
import path from 'path';

// Load the appropriate .env file based on NODE_ENV
const envPath = path.resolve(__dirname, `../../.env.${process.env.NODE_ENV || 'development'}`);
dotenv.config({ path: envPath });

interface Config {
  port: number;
  nodeEnv: string;
  databaseUrl: string;
  // Add other configurations as needed
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/defaultdb',
};

export default config;