const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subject:  { type: String, required: true, trim: true },
  type:     { type: String, enum: ['focus', 'review', 'practice'], default: 'focus' },
  durationMinutes: { type: Number, required: true, min: 1 },
  notes:    { type: String },
  date:     { type: Date, default: Date.now, index: true },
}, { timestamps: true });

studySessionSchema.index({ user: 1, date: -1 });
module.exports = mongoose.model('StudySession', studySessionSchema);
