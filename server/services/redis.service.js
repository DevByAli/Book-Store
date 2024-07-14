import { createClient } from "redis";
import { config as configDotenv } from "dotenv";

configDotenv();

class RedisClient {
  constructor() {
    this.client = createClient({
      password: process.env.REDIS_PASSWORD,
      socket: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
    });

    this.client.on("error", (error) => this.handleError(error));
  }

  handleError(error) {
    console.error(`Redis error: ${error}`);
  }

  async connect() {
    try {
      await this.client.connect();
      console.log("Connected to Redis");
    } catch (error) {
      this.handleError(error);
    }
  }

  async set(key, value) {
    try {
      await this.client.set(key, value);
    } catch (error) {
      this.handleError(error);
    }
  }

  async get(key) {
    try {
      return await this.client.get(key);
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(key) {
    try {
      await this.client.del(key);
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteKeysByValue(valueToDelete) {
    try {
      const keys = await this.client.keys("*");

      for (const key of keys) {
        const value = await this.get(key);

        if (value === valueToDelete) {
          await this.delete(key);
          console.log(`Deleted key: ${key}`);
          return;
        }
      }
    } catch (error) {
      console.error(`Error deleting keys by value: ${error}`);
    }
  }
}

const redisClientInstance = new RedisClient();

export default redisClientInstance;
