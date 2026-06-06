const SleepLog = require('../models/SleepLog');

const getLogs = (userId, limit = 14) =>
  SleepLog.find({ user: userId }).sort({ date: -1 }).limit(Number(limit));

const createLog = (userId, body) => SleepLog.create({ ...body, user: userId });

const deleteLog = (userId, id) =>
  SleepLog.findOneAndDelete({ _id: id, user: userId });

const getWeekStats = async (userId) => {
  const logs = await getLogs(userId, 7);
  if (!logs.length) return { logs: [], avgHours: 0, avgQuality: 0 };
  const avgHours = logs.reduce((s, l) => s + (l.durationHours || 0), 0) / logs.length;
  const avgQuality = logs.reduce((s, l) => s + (l.quality || 0), 0) / logs.length;
  return {
    logs,
    avgHours: parseFloat(avgHours.toFixed(2)),
    avgQuality: parseFloat(avgQuality.toFixed(1)),
  };
};

module.exports = { getLogs, createLog, deleteLog, getWeekStats };