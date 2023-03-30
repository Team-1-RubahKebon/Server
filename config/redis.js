const Redis = require("ioredis");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const redis = new Redis({
  port: 18161,
  host: "redis-18161.c252.ap-southeast-1-1.ec2.cloud.redislabs.com",
  password: process.env.REDIS_PASSWORD,
});

module.exports = redis;
