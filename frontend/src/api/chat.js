import client from './client';

/** Used by the floating ChatWidget — lightweight, no extra DB calls */
export const sendMessage = (message, history) =>
  client.post('/chat', { message, history });

/**
 * Used by the full Chat page.
 * The backend fetches all user data server-side and injects it into the system prompt,
 * so Lumi can give genuinely personalised, data-driven answers.
 */
export const sendContextualMessage = (message, history) =>
  client.post('/chat/contextual', { message, history });

export const getInsight = (type) =>
  client.get('/chat/insight', { params: { type } });
