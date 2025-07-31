// Scan worker using BullMQ, Puppeteer, and axe-core
const { Worker, QueueScheduler } = require('bullmq');
const puppeteer = require('puppeteer');
const axeCore = require('axe-core');
const mongoose = require('mongoose');
const { connection } = require('../queue');
const Scan = require('../models/Scan');
const Website = require('../models/Website');
const logger = require('../logger');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/beacon';

// Ensure MongoDB connection for worker
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

new QueueScheduler('scan', { connection });

const scanWorker = new Worker('scan', async job => {
  try {
    const scan = await Scan.findById(job.data.scanId);
    if (!scan) throw new Error('Scan not found');
    const website = await Website.findById(scan.website);
    if (!website) throw new Error('Website not found');

    scan.status = 'running';
    await scan.save();

    // Launch Puppeteer and run axe-core
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(website.url, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.addScriptTag({ content: axeCore.source });
    const axeResults = await page.evaluate(async () => {
      return await window.axe.run();
    });
    await browser.close();

    scan.status = 'completed';
    scan.completedAt = new Date();
    scan.result = axeResults;
    await scan.save();
    logger.info(`Scan ${scan._id} completed for ${website.url}`);
  } catch (err) {
    logger.error('Scan worker error:', err);
    if (job.data && job.data.scanId) {
      await Scan.findByIdAndUpdate(job.data.scanId, { status: 'failed', error: err.message });
    }
    throw err;
  }
}, { connection });

scanWorker.on('failed', (job, err) => {
  logger.error(`Job ${job.id} failed:`, err);
});

logger.info('Scan worker started.');
