const scheduleService = require('../services/schedule.service');
const { ok, fail } = require('../utils/response');

exports.getEvents = async (req, res, next) => { try { ok(res, await scheduleService.getEvents(req.user._id, req.query.date)); } catch (e) { next(e); }};
exports.create    = async (req, res, next) => {
  try {
    if (!req.body.title || !req.body.start || !req.body.end) return fail(res, 'title, start, end required');
    ok(res, await scheduleService.createEvent(req.user._id, req.body), 201);
  } catch (e) { next(e); }
};
exports.update = async (req, res, next) => { try { ok(res, await scheduleService.updateEvent(req.user._id, req.params.id, req.body)); } catch (e) { next(e); }};
exports.remove = async (req, res, next) => { try { ok(res, await scheduleService.deleteEvent(req.user._id, req.params.id)); } catch (e) { next(e); }};
