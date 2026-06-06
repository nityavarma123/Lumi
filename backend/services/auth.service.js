const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });

const register = async ({ name, email, password }) => {
  if (await User.findOne({ email })) throw new Error('Email already registered');
  const user  = await User.create({ name, email, password });
  const token = signToken(user._id);
  return { token, user: { id: user._id, name: user.name, email: user.email, streak: user.streak, goals: user.goals } };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) throw new Error('Invalid credentials');
  const token = signToken(user._id);
  return { token, user: { id: user._id, name: user.name, email: user.email, streak: user.streak, goals: user.goals } };
};

const getMe = async (userId) => User.findById(userId);

const updateGoals = async (userId, goals) =>
  User.findByIdAndUpdate(userId, { goals }, { new: true, runValidators: true });

module.exports = { register, login, getMe, updateGoals };
