const Redis = require("ioredis");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Create a Redis instance.
// By default, it will connect to localhost:6379.
// We are going to cover how to specify connection options soon.
const redis = new Redis({
  port: 18161, // Redis port
  host: "redis-18161.c252.ap-southeast-1-1.ec2.cloud.redislabs.com", // Redis host
  password: process.env.REDIS_PASSWORD,
});

module.exports = redis;
