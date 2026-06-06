import client from './client';
export const getLogs  = (date) => client.get('/activity', { params: { date } });
export const getStats = (date) => client.get('/activity/stats', { params: { date } });
export const create   = (body) => client.post('/activity', body);
