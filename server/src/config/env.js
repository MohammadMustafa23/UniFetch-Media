import dotenv from "dotenv";
dotenv.config();

export const REDIS_URL = process.env.REDIS_URL;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;
export const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL; 
export const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;