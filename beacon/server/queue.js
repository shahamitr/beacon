// BullMQ queue setup for scan jobs
const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');
const scanQueue = new Queue('scan', { connection });

module.exports = { scanQueue, connection };
