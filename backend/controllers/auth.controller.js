const authService = require('../services/auth.service');
const { ok, fail } = require('../utils/response');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return fail(res, 'All fields required');
    const result = await authService.register({ name, email, password });
    ok(res, result, 201);
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return fail(res, 'Email and password required');
    const result = await authService.login({ email, password });
    ok(res, result);
  } catch (err) { next(err); }
};

exports.me = async (req, res, next) => {
  try { ok(res, req.user); } catch (err) { next(err); }
};

exports.updateGoals = async (req, res, next) => {
  try {
    const user = await authService.updateGoals(req.user._id, req.body);
    ok(res, user);
  } catch (err) { next(err); }
};
