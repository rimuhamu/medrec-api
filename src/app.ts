import createApp from './lib/create-app.ts';

const app = createApp();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.get('/error', (c) => {
  c.status(422);
  c.var.logger.debug('only visible when debug level enabled!');
  throw new Error('Oh NO');
});

export default app;
