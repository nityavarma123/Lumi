const nutritionService = require('../services/nutrition.service');
const aiService        = require('../services/ai.service');
const { ok, fail }     = require('../utils/response');

exports.getMeals = async (req, res, next) => {
  try { ok(res, await nutritionService.getMeals(req.user._id, req.query.date)); }
  catch (err) { next(err); }
};

exports.getTotals = async (req, res, next) => {
  try { ok(res, await nutritionService.getDayTotals(req.user._id, req.query.date)); }
  catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    if (!req.body.name) return fail(res, 'name is required');
    ok(res, await nutritionService.createMeal(req.user._id, req.body), 201);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try { ok(res, await nutritionService.deleteMeal(req.user._id, req.params.id)); }
  catch (err) { next(err); }
};

// Uses GPT-4o mini to estimate nutrition for a natural-language food query
exports.lookupFood = async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query?.trim()) return fail(res, 'query is required');

    const result = await aiService.lookupNutrition(query.trim());
    ok(res, result);
  } catch (err) { next(err); }
};
