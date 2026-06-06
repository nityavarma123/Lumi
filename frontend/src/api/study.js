import client from './client';
export const getSessions = (date) => client.get('/study', { params: { date } });
export const getWeek     = ()     => client.get('/study/week');
export const getTotals   = ()     => client.get('/study/totals');
export const create      = (body) => client.post('/study', body);
export const remove      = (id)   => client.delete(`/study/${id}`);
