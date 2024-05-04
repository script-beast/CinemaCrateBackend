import redisConnection from '../../connections/redis.connection';

class RedisLibs {
  public get = async (key: string) => {
    return await redisConnection.get(key);
  };

  public setex = async (key: string, time: number, value: string) => {
    return await redisConnection.setex(key, time, value);
  };

  public del = async (key: string) => {
    return await redisConnection.del(key);
  };

  public delAllKeysStartingWith = async (key: string) => {
    const deleted = await redisConnection.keys(key);
    if (deleted.length > 0) deleted.forEach((key) => redisConnection.del(key));
    console.log(`Deleted ${deleted} keys starting with "${key}"`);
  };
}

export default new RedisLibs();
