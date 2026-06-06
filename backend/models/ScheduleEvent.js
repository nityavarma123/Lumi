const mongoose = require('mongoose');

const scheduleEventSchema = new mongoose.Schema({
  user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title:  { type: String, required: true, trim: true },
  type:   { type: String, enum: ['class', 'study', 'gym', 'meal', 'sleep', 'other'], default: 'other' },
  start:  { type: Date, required: true },
  end:    { type: Date, required: true },
  notes:  { type: String },
  color:  { type: String },
  repeat: { type: String, enum: ['none', 'daily', 'weekly'], default: 'none' },
}, { timestamps: true });

scheduleEventSchema.index({ user: 1, start: 1 });
module.exports = mongoose.model('ScheduleEvent', scheduleEventSchema);
