const express = require('express');
const router = express.Router();
const Environment = require('../models/Environment');
const { protect } = require('../middleware/auth');

// @route POST /api/environment/add
router.post('/add', protect, async (req, res) => {
  try {
    const {
      blockName, month, year,
      energyUsed, waterUsed,
      totalWaste, recycledWaste,
      treesPlanted
    } = req.body;

    // Validation
    if (!blockName || !month || !year || energyUsed == null || waterUsed == null || totalWaste == null || recycledWaste == null) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (Number(recycledWaste) > Number(totalWaste)) {
      return res.status(400).json({ message: 'Recycled waste cannot exceed total waste' });
    }

    const record = new Environment({
      blockName, month, year: Number(year),
      energyUsed:    Number(energyUsed),
      waterUsed:     Number(waterUsed),
      totalWaste:    Number(totalWaste),
      recycledWaste: Number(recycledWaste),
      treesPlanted:  Number(treesPlanted) || 0
    });

    await record.save();
    res.status(201).json({ message: 'Data added successfully', record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/environment
router.get('/', protect, async (req, res) => {
  try {
    const records = await Environment.find().sort({ year: -1, createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/environment/filter?block=Library&year=2025
router.get('/filter', protect, async (req, res) => {
  try {
    const { block, year } = req.query;
    const query = {};
    if (block && block !== 'All') query.blockName = block;
    if (year  && year  !== 'All') query.year = Number(year);
    const records = await Environment.find(query).sort({ year: -1, month: 1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// @route DELETE /api/environment/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const record = await Environment.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    await record.deleteOne();
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
