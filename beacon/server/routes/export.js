import express from 'express';
import Scan from '../models/Scan.js';
import Website from '../models/Website.js';
import auth from '../middleware/auth.js';
import { Parser as Json2csvParser } from 'json2csv';
import { createObjectCsvStringifier } from 'csv-writer';
const logger = require('../logger.js');
import PDFDocument from 'pdfkit';

const router = express.Router();

// Export scan issues as CSV
router.get('/scan/:scanId/csv', auth, async (req, res) => {
  try {
    const scan = await Scan.findOne({ _id: req.params.scanId, user: req.user.id });
    if (!scan) return res.status(404).json({ message: 'Scan not found.' });
    const fields = ['ruleId', 'impact', 'description', 'help', 'wcag', 'wcagLevel', 'selector', 'html', 'context'];
    const parser = new Json2csvParser({ fields });
    const csv = parser.parse(scan.issues || []);
    res.header('Content-Type', 'text/csv');
    res.attachment(`scan-${scan._id}.csv`);
    res.send(csv);
  } catch (err) {
    logger.error('CSV export failed: %s', err.stack || err.message);
    res.status(500).json({ message: 'CSV export failed.' });
  }
});

// Export scan issues as Excel (CSV for now, can be extended)
router.get('/scan/:scanId/excel', auth, async (req, res) => {
  try {
    const scan = await Scan.findOne({ _id: req.params.scanId, user: req.user.id });
    if (!scan) return res.status(404).json({ message: 'Scan not found.' });
    // For MVP, Excel = CSV. For real Excel, use exceljs or xlsx.
    const fields = ['ruleId', 'impact', 'description', 'help', 'wcag', 'wcagLevel', 'selector', 'html', 'context'];
    const parser = new Json2csvParser({ fields });
    const csv = parser.parse(scan.issues || []);
    res.header('Content-Type', 'application/vnd.ms-excel');
    res.attachment(`scan-${scan._id}.xls`);
    res.send(csv);
  } catch (err) {
    logger.error('Excel export failed: %s', err.stack || err.message);
    res.status(500).json({ message: 'Excel export failed.' });
  }
});

// Executive PDF report
router.get('/scan/:scanId/pdf', auth, async (req, res) => {
  try {
    const scan = await Scan.findOne({ _id: req.params.scanId, user: req.user.id }).populate('website');
    if (!scan) return res.status(404).json({ message: 'Scan not found.' });
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=scan-${scan._id}.pdf`);
    doc.pipe(res);
    doc.fontSize(18).text('Accessibility Executive Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Website: ${scan.website.name} (${scan.website.url})`);
    doc.text(`Scan Date: ${scan.completedAt}`);
    doc.text(`Total Issues: ${scan.issues.length}`);
    doc.moveDown();
    doc.fontSize(14).text('Issues Summary:');
    doc.moveDown(0.5);
    (scan.issues || []).slice(0, 20).forEach((issue, idx) => {
      doc.fontSize(10).text(`${idx + 1}. [${issue.impact}] ${issue.description} (WCAG: ${issue.wcag || 'N/A'})`);
      doc.fontSize(8).text(`Selector: ${issue.selector}`);
      doc.moveDown(0.2);
    });
    if ((scan.issues || []).length > 20) {
      doc.fontSize(10).text(`...and ${scan.issues.length - 20} more issues.`);
    }
    doc.end();
  } catch (err) {
    logger.error('PDF export failed: %s', err.stack || err.message);
    res.status(500).json({ message: 'PDF export failed.' });
  }
});

export default router;
