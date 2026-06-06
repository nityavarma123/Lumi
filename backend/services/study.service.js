const StudySession = require('../models/StudySession');

const dayRange = (date) => {
  const d = date ? new Date(date) : new Date();
  const start = new Date(d); start.setHours(0,0,0,0);
  const end   = new Date(d); end.setHours(23,59,59,999);
  return { $gte: start, $lte: end };
};

const getSessions = (userId, date) =>
  StudySession.find({ user: userId, date: dayRange(date) }).sort({ date: -1 });

const getWeekSessions = async (userId) => {
  const start = new Date(); start.setDate(start.getDate() - 6); start.setHours(0,0,0,0);
  return StudySession.find({ user: userId, date: { $gte: start } }).sort({ date: 1 });
};

const createSession = (userId, body) =>
  StudySession.create({ ...body, user: userId });

const deleteSession = (userId, id) =>
  StudySession.findOneAndDelete({ _id: id, user: userId });

const getSubjectTotals = async (userId) => {
  const start = new Date(); start.setHours(0,0,0,0);
  return StudySession.aggregate([
    { $match: { user: userId, date: { $gte: start } } },
    { $group: { _id: '$subject', totalMins: { $sum: '$durationMinutes' }, count: { $sum: 1 } } },
    { $sort: { totalMins: -1 } },
  ]);
};

module.exports = { getSessions, getWeekSessions, createSession, deleteSession, getSubjectTotals };
