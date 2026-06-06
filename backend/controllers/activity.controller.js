const activityService = require('../services/activity.service');
const { ok, fail } = require('../utils/response');

exports.getLogs  = async (req, res, next) => { try { ok(res, await activityService.getLogs(req.user._id, req.query.date)); } catch (e) { next(e); }};
exports.getStats = async (req, res, next) => { try { ok(res, await activityService.getDayStats(req.user._id, req.query.date)); } catch (e) { next(e); }};
exports.create   = async (req, res, next) => {
  try {
    if (!req.body.type || !req.body.durationMinutes) return fail(res, 'type and durationMinutes required');
    ok(res, await activityService.createLog(req.user._id, req.body), 201);
  } catch (e) { next(e); }
};
