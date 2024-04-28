import { Redis } from 'ioredis';

// const redisConnection = new Redis('redis://localhost:6379');

const redisConnection = new Redis(
  'rediss://red-con9en4f7o1s73fg5fe0:if6w7fV0di2pQhL7hHiw5twyO4GZXFJr@singapore-redis.render.com:6379',
);

export default redisConnection;
