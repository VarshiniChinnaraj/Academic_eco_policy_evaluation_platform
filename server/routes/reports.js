const express = require('express');
const router = express.Router();
const Environment = require('../models/Environment');
const { protect } = require('../middleware/auth');

// @route GET /api/reports/download?format=csv&block=All&year=All
router.get('/download', protect, async (req, res) => {
  try {
    const { format = 'csv', block, year } = req.query;
    const query = {};
    if (block && block !== 'All') query.blockName = block;
    if (year  && year  !== 'All') query.year = Number(year);

    const records = await Environment.find(query).sort({ year: -1, month: 1 });

    if (format === 'csv') {
      // CSV generation
      const headers = [
        'Block', 'Month', 'Year',
        'Energy (kWh)', 'Water (L)', 'Total Waste (kg)', 'Recycled Waste (kg)',
        'Trees Planted', 'Sustainability Score', 'Carbon Emission (kg CO2)'
      ];
      const rows = records.map(r => [
        r.blockName, r.month, r.year,
        r.energyUsed, r.waterUsed, r.totalWaste, r.recycledWaste,
        r.treesPlanted, r.sustainabilityScore, r.carbonEmission
      ]);

      let csv = headers.join(',') + '\n';
      rows.forEach(row => {
        csv += row.map(v => `"${v}"`).join(',') + '\n';
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="eco_report.csv"');
      return res.send(csv);
    }

    if (format === 'pdf') {
      const PDFDocument = require('pdfkit');
      const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="eco_report.pdf"');
      doc.pipe(res);

      // Title
      doc.fontSize(18).fillColor('#1a7a4a').text('Academic Eco Policy Evaluation Platform', { align: 'center' });
      doc.fontSize(12).fillColor('#333').text('Environmental Sustainability Report', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#666').text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, { align: 'center' });
      doc.moveDown(1);

      // Table header
      const cols = [
        { label: 'Block',       x: 30,  w: 110 },
        { label: 'Month',       x: 140, w: 65  },
        { label: 'Year',        x: 205, w: 40  },
        { label: 'Energy(kWh)', x: 245, w: 65  },
        { label: 'Water(L)',    x: 310, w: 65  },
        { label: 'Waste(kg)',   x: 375, w: 60  },
        { label: 'Recycled',    x: 435, w: 60  },
        { label: 'Trees',       x: 495, w: 45  },
        { label: 'Eco Score',   x: 540, w: 60  },
        { label: 'CO2(kg)',     x: 600, w: 65  },
      ];

      const rowH = 18;
      let y = doc.y;

      // Header row
      doc.rect(30, y, 635, rowH).fill('#1a7a4a');
      doc.fillColor('white').fontSize(8);
      cols.forEach(c => doc.text(c.label, c.x + 2, y + 4, { width: c.w - 4 }));
      y += rowH;

      // Data rows
      records.forEach((r, i) => {
        if (y > 520) {
          doc.addPage({ margin: 30, size: 'A4', layout: 'landscape' });
          y = 30;
        }
        const bg = i % 2 === 0 ? '#f0faf4' : '#ffffff';
        doc.rect(30, y, 635, rowH).fill(bg);
        doc.fillColor('#222').fontSize(7);
        const vals = [r.blockName, r.month, r.year, r.energyUsed, r.waterUsed, r.totalWaste, r.recycledWaste, r.treesPlanted, r.sustainabilityScore, r.carbonEmission];
        cols.forEach((c, ci) => doc.text(String(vals[ci] ?? ''), c.x + 2, y + 4, { width: c.w - 4 }));
        y += rowH;
      });

      doc.end();
      return;
    }

    res.status(400).json({ message: 'Invalid format. Use csv or pdf' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
