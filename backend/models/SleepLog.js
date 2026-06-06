const mongoose = require('mongoose');

const sleepLogSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  bedtime:  { type: Date, required: true },
  wakeTime: { type: Date, required: true },
  durationHours:  { type: Number },
  quality:        { type: Number, min: 1, max: 10 },
  recoveryScore:  { type: Number, min: 0, max: 100 },
  notes:          { type: String },
  date:           { type: Date, default: Date.now, index: true },
}, { timestamps: true });

sleepLogSchema.pre('save', function (next) {
  if (this.bedtime && this.wakeTime)
    this.durationHours = parseFloat(((this.wakeTime - this.bedtime) / 3_600_000).toFixed(2));
  next();
});

sleepLogSchema.index({ user: 1, date: -1 });
module.exports = mongoose.model('SleepLog', sleepLogSchema);
