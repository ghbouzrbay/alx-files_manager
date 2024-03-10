import { promisify } from 'util';
import { createClient } from 'redis';

/**
 *  the class RedisClient
 */
class RedisClient {
  /**
   * The Class that creates a client to Redis
   */
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;
    this.client.on('error', (err) => {
      console.error('Redis client failed to connect:', err.message || err.toString());
      this.isClientConnected = false;
    });
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }
  /**
   * 
   * @returns {boolean}
   */
   
  isAlive() {
    return this.isClientConnected;
  }

  /**
   * @param {String} key 
   * @returns {String | Object}
   */
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
   * @param {String} key
   * @param {String | Number | Boolean} value
   * @param {Number} duration
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    await promisify(this.client.SETEX)
      .bind(this.client)(key, duration, value);
  }

  /**
   * @param {String} key
   * @returns {Promise<void>}
   */
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;

