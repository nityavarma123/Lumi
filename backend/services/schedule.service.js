const ScheduleEvent = require('../models/ScheduleEvent');

const dayRange = (date) => {
  const d = date ? new Date(date) : new Date();
  const s = new Date(d); s.setHours(0,0,0,0);
  const e = new Date(d); e.setHours(23,59,59,999);
  return { $gte: s, $lte: e };
};

const getEvents = (userId, date) =>
  ScheduleEvent.find({ user: userId, start: dayRange(date) }).sort({ start: 1 });

const createEvent = (userId, body) => ScheduleEvent.create({ ...body, user: userId });

const updateEvent = (userId, id, body) =>
  ScheduleEvent.findOneAndUpdate({ _id: id, user: userId }, body, { new: true, runValidators: true });

const deleteEvent = (userId, id) =>
  ScheduleEvent.findOneAndDelete({ _id: id, user: userId });

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
