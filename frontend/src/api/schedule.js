import client from './client';
export const getEvents = (date) => client.get('/schedule', { params: { date } });
export const create    = (body) => client.post('/schedule', body);
export const update    = (id, body) => client.patch(`/schedule/${id}`, body);
export const remove    = (id)   => client.delete(`/schedule/${id}`);
