const ActivityLog = require('../models/ActivityLog');

const dayRange = (date) => {
  const d = date ? new Date(date) : new Date();
  const s = new Date(d); s.setHours(0,0,0,0);
  const e = new Date(d); e.setHours(23,59,59,999);
  return { $gte: s, $lte: e };
};

const getLogs = (userId, date) =>
  ActivityLog.find({ user: userId, date: dayRange(date) }).sort({ date: -1 });

const createLog = (userId, body) => ActivityLog.create({ ...body, user: userId });

const getDayStats = async (userId, date) => {
  const logs = await getLogs(userId, date);
  const totalCal  = logs.reduce((s, a) => s + (a.caloriesBurned || 0), 0);
  const totalMins = logs.reduce((s, a) => s + (a.durationMinutes || 0), 0);
  const totalSteps= logs.reduce((s, a) => s + (a.steps || 0), 0);
  return { logs, totalCal, totalMins, totalSteps };
};

module.exports = { getLogs, createLog, getDayStats };
