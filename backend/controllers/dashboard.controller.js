const dashboardService = require('../services/dashboard.service');
const { ok } = require('../utils/response');

exports.get = async (req, res, next) => {
  try {
    const data = await dashboardService.getDashboard(req.user._id, req.user.goals);
    ok(res, data);
  } catch (err) { next(err); }
};
