import redis from 'redis';

const redisClient = redis.createClient({
  url: process.env.REDIS_URL // Use the Redis URL from Render
});

redisClient.on('error', (err) => {
  console.log("Redis Error " + err);
});

// Connect to Redis
await redisClient.connect();

// Function to set data in the cache with an expiration time
export const setCache = async (key, data, expiration = 3600) => {
  try {
    await redisClient.setEx(key, expiration, JSON.stringify(data)); // Cache data with expiration in seconds
    console.log(`Data cached for key: ${key}`);
  } catch (error) {
    console.error(`Error caching data for key: ${key} - ${error}`);
  }
};

// Function to get data from cache
export const getCache = async (key) => {
    try {
      const data = await redisClient.get(key);
      if (data) {
        console.log(`Cache hit for key: ${key}`);
        return JSON.parse(data); // Parse the cached JSON string back to a JavaScript object
      }
      console.log(`Cache miss for key: ${key}`);
      return null;
    } catch (error) {
      console.error(`Error getting cache for key: ${key} - ${error}`);
      return null;
    }
  };
// Function to delete cache for a specific key
export const deleteCache = async (key) => {
    try {
      await redisClient.del(key);
      console.log(`Cache cleared for key: ${key}`);
    } catch (error) {
      console.error(`Error deleting cache for key: ${key} - ${error}`);
    }
  };
// Function to update the cache after data has been modified
export const updateCache = async (key, newData, expiration = 3600) => {
    try {
      // First, delete the old cache
      await deleteCache(key);
      
      // Then, set the new data in the cache
      await setCache(key, newData, expiration);
      console.log(`Cache updated for key: ${key}`);
    } catch (error) {
      console.error(`Error updating cache for key: ${key} - ${error}`);
    }
  };
      
  export const isRedisAlive = async () => {
    try {
      const pong = await redisClient.ping();
      return pong === 'PONG'; // If Redis responds with "PONG", it is alive
    } catch (error) {
      console.error('Redis connection error:', error);
      return false;
    }
  };