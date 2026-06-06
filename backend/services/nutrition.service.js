const MealLog = require('../models/MealLog');

const dayRange = (date) => {
  const d = date ? new Date(date) : new Date();
  const s = new Date(d); s.setHours(0,0,0,0);
  const e = new Date(d); e.setHours(23,59,59,999);
  return { $gte: s, $lte: e };
};

const getMeals = (userId, date) =>
  MealLog.find({ user: userId, date: dayRange(date) }).sort({ date: 1 });

const createMeal = (userId, body) => MealLog.create({ ...body, user: userId });

const deleteMeal = (userId, id) => MealLog.findOneAndDelete({ _id: id, user: userId });

const getDayTotals = async (userId, date) => {
  const meals = await getMeals(userId, date);
  return meals.reduce(
    (acc, m) => ({
      calories: acc.calories + (m.calories || 0),
      protein:  acc.protein  + (m.protein  || 0),
      carbs:    acc.carbs    + (m.carbs    || 0),
      fat:      acc.fat      + (m.fat      || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
};

module.exports = { getMeals, createMeal, deleteMeal, getDayTotals };
