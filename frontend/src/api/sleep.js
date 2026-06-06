import client from './client';

export const getLogs = (limit) => client.get('/sleep', { params: { limit } });
export const getStats = () => client.get('/sleep/stats');
export const create = (body) => client.post('/sleep', body);
export const remove = (id) => client.delete(`/sleep/${id}`);