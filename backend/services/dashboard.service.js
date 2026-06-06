const studyService    = require('./study.service');
const sleepService    = require('./sleep.service');
const nutritionService= require('./nutrition.service');
const activityService = require('./activity.service');
const aiService       = require('./ai.service');

const getDashboard = async (userId, userGoals) => {
  const [subjectTotals, sleepStats, nutritionTotals, activityStats] = await Promise.all([
    studyService.getSubjectTotals(userId),
    sleepService.getWeekStats(userId),
    nutritionService.getDayTotals(userId),
    activityService.getDayStats(userId),
  ]);

  const studyMinsToday = subjectTotals.reduce((s, x) => s + x.totalMins, 0);
  const latestSleep    = sleepStats?.logs?.[0];

  const stats = {
    sleep:     { hours: latestSleep?.durationHours ?? 0, goal: userGoals?.sleepHours ?? 8 },
    study:     { mins: studyMinsToday, goal: (userGoals?.studyHours ?? 4) * 60 },
    nutrition: { calories: nutritionTotals.calories, goal: userGoals?.calories ?? 2000 },
    activity:  { mins: activityStats.totalMins, steps: activityStats.totalSteps, goal: userGoals?.activityMins ?? 60 },
  };

  let insight = "How are you doing today? 🌿";
  try {
    insight = await aiService.getInsight('wellness', stats);
  } catch {
    // AI unavailable — use fallback
  }

  return { stats, insight };
};

module.exports = { getDashboard };
