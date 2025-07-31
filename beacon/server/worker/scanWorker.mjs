import { Worker, QueueScheduler } from 'bullmq';
import puppeteer from 'puppeteer';
import axeCore from 'axe-core';
import mongoose from 'mongoose';
import { connection } from '../queue.js';
import Scan from '../models/Scan.js';
import Website from '../models/Website.js';
import logger from '../logger.js';
import wcagMap from '../wcag-map.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/beacon';
await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

new QueueScheduler('scan', { connection });

const scanWorker = new Worker('scan', async job => {
  try {
    const scan = await Scan.findById(job.data.scanId);
    if (!scan) throw new Error('Scan not found');
    const website = await Website.findById(scan.website);
    if (!website) throw new Error('Website not found');

    scan.status = 'running';
    scan.startedAt = new Date();
    await scan.save();

    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(website.url, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.addScriptTag({ content: axeCore.source });
    const axeResults = await page.evaluate(async () => {
      return await window.axe.run();
    });
    await browser.close();

    // Process and enrich issues
    const processedIssues = (axeResults.violations || []).map(v =>
      v.nodes.map(node => {
        const wcag = wcagMap[v.id] || {};
        // Simple fingerprint: ruleId + selector + html
        const selector = (node.target && node.target[0]) || '';
        const html = node.html || '';
        const fingerprint = `${v.id}|${selector}|${html}`;
        return {
          fingerprint,
          ruleId: v.id,
          impact: v.impact,
          description: v.description,
          help: v.help,
          wcag: wcag.wcag || '',
          wcagLevel: wcag.level || '',
          selector,
          html,
          context: node.failureSummary || '',
        };
      })
    ).flat();

    scan.status = 'completed';
    scan.completedAt = new Date();
    scan.result = axeResults;
    scan.issues = processedIssues;
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
