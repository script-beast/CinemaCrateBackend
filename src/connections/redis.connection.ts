import { Redis } from 'ioredis';

const redisConnection = new Redis(String(process.env.REDIS_URL));

export default redisConnection;
