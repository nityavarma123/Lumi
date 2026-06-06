import client from './client';
export const register    = (body)   => client.post('/auth/register', body);
export const login       = (body)   => client.post('/auth/login',    body);
export const me          = ()       => client.get('/auth/me');
export const updateGoals = (goals)  => client.patch('/auth/goals', goals);
