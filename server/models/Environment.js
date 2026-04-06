const mongoose = require('mongoose');

// Score calculation helpers
function calcEnergyScore(kwh) {
  // Lower is better. Baseline: 1000 kWh/month = score 5
  if (kwh <= 300)  return 10;
  if (kwh <= 500)  return 9;
  if (kwh <= 700)  return 8;
  if (kwh <= 900)  return 7;
  if (kwh <= 1100) return 6;
  if (kwh <= 1400) return 5;
  if (kwh <= 1700) return 4;
  if (kwh <= 2000) return 3;
  if (kwh <= 2500) return 2;
  return 1;
}

function calcWaterScore(liters) {
  if (liters <= 5000)  return 10;
  if (liters <= 10000) return 9;
  if (liters <= 15000) return 8;
  if (liters <= 20000) return 7;
  if (liters <= 25000) return 6;
  if (liters <= 30000) return 5;
  if (liters <= 40000) return 4;
  if (liters <= 50000) return 3;
  if (liters <= 70000) return 2;
  return 1;
}

function calcWasteScore(total, recycled) {
  if (!total || total === 0) return 10;
  const recycleRatio = recycled / total;
  if (recycleRatio >= 0.9) return 10;
  if (recycleRatio >= 0.8) return 9;
  if (recycleRatio >= 0.7) return 8;
  if (recycleRatio >= 0.6) return 7;
  if (recycleRatio >= 0.5) return 6;
  if (recycleRatio >= 0.4) return 5;
  if (recycleRatio >= 0.3) return 4;
  if (recycleRatio >= 0.2) return 3;
  if (recycleRatio >= 0.1) return 2;
  return 1;
}

function calcCarbonEmission(energyKwh, totalWasteKg) {
  // CO2 factors: electricity ~0.92 kg CO2/kWh (India grid), waste ~0.5 kg CO2/kg
  return parseFloat(((energyKwh * 0.92) + (totalWasteKg * 0.5)).toFixed(2));
}

const EnvironmentSchema = new mongoose.Schema({
  blockName: {
    type: String,
    required: true,
    enum: ['Academic Block', 'Laboratory Block', 'Administrative Block', 'Hostel Block', 'Library Block']
  },
  month: {
    type: String,
    required: true,
    enum: ['January','February','March','April','May','June','July','August','September','October','November','December']
  },
  year:          { type: Number, required: true },
  energyUsed:    { type: Number, required: true, min: 0 },  // kWh
  waterUsed:     { type: Number, required: true, min: 0 },  // Liters
  totalWaste:    { type: Number, required: true, min: 0 },  // kg
  recycledWaste: { type: Number, required: true, min: 0 },  // kg
  treesPlanted:  { type: Number, default: 0, min: 0 },

  // Auto-calculated fields
  energyScore:         { type: Number },
  waterScore:          { type: Number },
  wasteScore:          { type: Number },
  sustainabilityScore: { type: Number },
  carbonEmission:      { type: Number },  // kg CO2

  createdAt: { type: Date, default: Date.now }
});

// Auto-calculate scores before saving
EnvironmentSchema.pre('save', function (next) {
  this.energyScore = calcEnergyScore(this.energyUsed);
  this.waterScore  = calcWaterScore(this.waterUsed);
  this.wasteScore  = calcWasteScore(this.totalWaste, this.recycledWaste);

  // Tree planting bonus (max +1 point bonus)
  const treeBonus = Math.min(this.treesPlanted * 0.05, 1);

  // Weighted average: energy 35%, water 30%, waste 35% + tree bonus
  const raw = (this.energyScore * 0.35) + (this.waterScore * 0.30) + (this.wasteScore * 0.35) + treeBonus;
  this.sustainabilityScore = parseFloat(Math.min(raw, 10).toFixed(2));

  this.carbonEmission = calcCarbonEmission(this.energyUsed, this.totalWaste);

  next();
});

module.exports = mongoose.model('Environment', EnvironmentSchema);
