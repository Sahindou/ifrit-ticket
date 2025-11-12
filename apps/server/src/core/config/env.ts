import dotenv from 'dotenv';
import { EnvConfig } from '@/shared/types';

dotenv.config();

export const env: EnvConfig = {
    PORT: parseInt(process.env.PORT || "3000"),
    NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test',
    ORIGIN: process.env.ORIGIN || "http://localhost:5173",
    DATABASE_URL: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/postgres",
    JWT_SECRET: process.env.JWT_SECRET || "SecretTresBienGardeNePasDivulgerPubliquement",
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "SecretTresBienGardeNePasDivulgerPubliquement",
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "SecretTresBienGardeNePasDivulgerPubliquement"
}