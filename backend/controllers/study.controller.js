const studyService = require('../services/study.service');
const { ok, fail } = require('../utils/response');

exports.getSessions  = async (req, res, next) => { try { ok(res, await studyService.getSessions(req.user._id, req.query.date)); } catch (e) { next(e); }};
exports.getWeek      = async (req, res, next) => { try { ok(res, await studyService.getWeekSessions(req.user._id)); } catch (e) { next(e); }};
exports.getTotals    = async (req, res, next) => { try { ok(res, await studyService.getSubjectTotals(req.user._id)); } catch (e) { next(e); }};
exports.create       = async (req, res, next) => {
  try {
    if (!req.body.subject || !req.body.durationMinutes) return fail(res, 'subject and durationMinutes required');
    ok(res, await studyService.createSession(req.user._id, req.body), 201);
  } catch (e) { next(e); }
};
exports.remove = async (req, res, next) => { try { ok(res, await studyService.deleteSession(req.user._id, req.params.id)); } catch (e) { next(e); }};
