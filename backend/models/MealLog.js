const mongoose = require('mongoose');

const mealLogSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name:     { type: String, required: true, trim: true },
  mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], default: 'snack' },
  calories: { type: Number, default: 0 },
  protein:  { type: Number, default: 0 },
  carbs:    { type: Number, default: 0 },
  fat:      { type: Number, default: 0 },
  date:     { type: Date, default: Date.now, index: true },
}, { timestamps: true });

mealLogSchema.index({ user: 1, date: -1 });
module.exports = mongoose.model('MealLog', mealLogSchema);
