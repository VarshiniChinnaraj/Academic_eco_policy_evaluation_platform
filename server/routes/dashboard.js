const express = require('express');
const router = express.Router();
const Environment = require('../models/Environment');
const { protect } = require('../middleware/auth');

// @route GET /api/dashboard
router.get('/', protect, async (req, res) => {
  try {
    const records = await Environment.find();

    if (!records.length) {
      return res.json({
        totalRecords: 0,
        avgSustainabilityScore: 0,
        totalCarbonEmission: 0,
        totalTreesPlanted: 0,
        blockWiseEnergy: [],
        blockWiseWater: [],
        blockWiseWaste: [],
        blockWiseSustainability: [],
        monthlyTrend: [],
        categoryBreakdown: {}
      });
    }

    // Totals
    const totalCarbonEmission = records.reduce((s, r) => s + (r.carbonEmission || 0), 0);
    const totalTreesPlanted   = records.reduce((s, r) => s + (r.treesPlanted   || 0), 0);
    const avgSustainabilityScore = (records.reduce((s, r) => s + r.sustainabilityScore, 0) / records.length).toFixed(2);

    // Block-wise aggregation
    const BLOCKS = ['Academic Block', 'Laboratory Block', 'Administrative Block', 'Hostel Block', 'Library Block'];
    const blockMap = {};
    BLOCKS.forEach(b => {
      blockMap[b] = { energy: 0, water: 0, waste: 0, recycled: 0, score: 0, count: 0 };
    });

    records.forEach(r => {
      if (blockMap[r.blockName]) {
        blockMap[r.blockName].energy   += r.energyUsed;
        blockMap[r.blockName].water    += r.waterUsed;
        blockMap[r.blockName].waste    += r.totalWaste;
        blockMap[r.blockName].recycled += r.recycledWaste;
        blockMap[r.blockName].score    += r.sustainabilityScore;
        blockMap[r.blockName].count    += 1;
      }
    });

    const blockWiseEnergy         = BLOCKS.map(b => ({ block: b, value: parseFloat(blockMap[b].energy.toFixed(2))  }));
    const blockWiseWater          = BLOCKS.map(b => ({ block: b, value: parseFloat(blockMap[b].water.toFixed(2))   }));
    const blockWiseWaste          = BLOCKS.map(b => ({
      block: b,
      total:    parseFloat(blockMap[b].waste.toFixed(2)),
      recycled: parseFloat(blockMap[b].recycled.toFixed(2)),
      recyclePercent: blockMap[b].waste > 0
        ? parseFloat(((blockMap[b].recycled / blockMap[b].waste) * 100).toFixed(1))
        : 0
    }));
    const blockWiseSustainability = BLOCKS.map(b => ({
      block: b,
      value: blockMap[b].count > 0
        ? parseFloat((blockMap[b].score / blockMap[b].count).toFixed(2))
        : 0
    }));

    // Monthly trend (last 12 months sorted)
    const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const monthMap = {};
    records.forEach(r => {
      const key = `${r.month} ${r.year}`;
      if (!monthMap[key]) monthMap[key] = { month: r.month, year: r.year, energy: 0, water: 0, score: 0, count: 0 };
      monthMap[key].energy += r.energyUsed;
      monthMap[key].water  += r.waterUsed;
      monthMap[key].score  += r.sustainabilityScore;
      monthMap[key].count  += 1;
    });

    const monthlyTrend = Object.values(monthMap)
      .sort((a, b) => a.year !== b.year ? a.year - b.year : MONTHS.indexOf(a.month) - MONTHS.indexOf(b.month))
      .slice(-12)
      .map(m => ({
        label:  `${m.month.substring(0,3)} ${m.year}`,
        energy: parseFloat(m.energy.toFixed(2)),
        water:  parseFloat(m.water.toFixed(2)),
        avgScore: parseFloat((m.score / m.count).toFixed(2))
      }));

    // Category breakdown (totals)
    const categoryBreakdown = {
      totalEnergy:    records.reduce((s, r) => s + r.energyUsed, 0).toFixed(2),
      totalWater:     records.reduce((s, r) => s + r.waterUsed, 0).toFixed(2),
      totalWaste:     records.reduce((s, r) => s + r.totalWaste, 0).toFixed(2),
      totalRecycled:  records.reduce((s, r) => s + r.recycledWaste, 0).toFixed(2),
    };

    res.json({
      totalRecords: records.length,
      avgSustainabilityScore: parseFloat(avgSustainabilityScore),
      totalCarbonEmission:    parseFloat(totalCarbonEmission.toFixed(2)),
      totalTreesPlanted,
      blockWiseEnergy,
      blockWiseWater,
      blockWiseWaste,
      blockWiseSustainability,
      monthlyTrend,
      categoryBreakdown
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
