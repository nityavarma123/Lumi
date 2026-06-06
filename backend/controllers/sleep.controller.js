const sleepService = require('../services/sleep.service');
const { ok, fail } = require('../utils/response');

exports.getLogs = async (req, res, next) => {
  try { ok(res, await sleepService.getLogs(req.user._id, req.query.limit)); }
  catch (err) { next(err); }
};

exports.getStats = async (req, res, next) => {
  try { ok(res, await sleepService.getWeekStats(req.user._id)); }
  catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    if (!req.body.bedtime || !req.body.wakeTime) return fail(res, 'bedtime and wakeTime required');
    ok(res, await sleepService.createLog(req.user._id, req.body), 201);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try { ok(res, await sleepService.deleteLog(req.user._id, req.params.id)); }
  catch (err) { next(err); }
};