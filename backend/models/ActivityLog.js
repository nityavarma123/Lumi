const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type:     { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  caloriesBurned:  { type: Number },
  steps:    { type: Number },
  intensity:{ type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  notes:    { type: String },
  date:     { type: Date, default: Date.now, index: true },
}, { timestamps: true });

activityLogSchema.index({ user: 1, date: -1 });
module.exports = mongoose.model('ActivityLog', activityLogSchema);
