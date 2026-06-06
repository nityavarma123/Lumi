import client from './client';

export const getMeals  = (date) => client.get('/nutrition', { params: { date } });
export const getTotals = (date) => client.get('/nutrition/totals', { params: { date } });
export const create    = (body) => client.post('/nutrition', body);
export const remove    = (id)   => client.delete(`/nutrition/${id}`);

/** AI-powered food lookup — returns estimated { name, calories, protein, carbs, fat, mealType } */
export const lookupFood = (query) => client.post('/nutrition/lookup', { query });
