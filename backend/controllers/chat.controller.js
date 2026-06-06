const aiService       = require('../services/ai.service');
const sleepService    = require('../services/sleep.service');
const studyService    = require('../services/study.service');
const nutritionService= require('../services/nutrition.service');
const activityService = require('../services/activity.service');
const scheduleService = require('../services/schedule.service');
const { ok, fail }    = require('../utils/response');

// ─── Simple chat (ChatWidget) ────────────────────────────────────────────────
exports.sendMessage = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;
    if (!message?.trim()) return fail(res, 'message is required');

    const userContext = `User: ${req.user.name}. Goals: ${JSON.stringify(req.user.goals)}`;
    const reply = await aiService.chat(message, history, userContext);

    ok(res, { reply });
  } catch (err) { next(err); }
};

// ─── Contextual chat (full Chat page) ───────────────────────────────────────
// Fetches all user data in parallel and injects it into Lumi's system prompt
// so she can give genuinely personalised, data-driven answers.
exports.sendContextualMessage = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;
    if (!message?.trim()) return fail(res, 'message is required');

    const [sleep, study, nutrition, activity, schedule] = await Promise.all([
      sleepService.getWeekStats(req.user._id),
      studyService.getSubjectTotals(req.user._id),
      nutritionService.getDayTotals(req.user._id),
      activityService.getDayStats(req.user._id),
      scheduleService.getEvents(req.user._id, new Date()),
    ]);

    const reply = await aiService.contextualChat(message, history, {
      user: req.user,
      sleep,
      study,
      nutrition,
      activity,
      schedule,
    });

    ok(res, { reply });
  } catch (err) { next(err); }
};

// ─── Wellness insight ────────────────────────────────────────────────────────
exports.getInsight = async (req, res, next) => {
  try {
    const insight = await aiService.getInsight(req.query.type || 'wellness', {});
    ok(res, { insight });
  } catch (err) { next(err); }
};
