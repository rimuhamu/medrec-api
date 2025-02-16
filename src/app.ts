import { OpenAPIHono } from '@hono/zod-openapi';
import { notFound, onError } from 'stoker/middlewares';
import { pLogger } from './middlewares/pino-logger.js';

const app = new OpenAPIHono();

app.use(pLogger());
app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.get('/error', (c) => {
  c.status(422);
  c.var.logger.info(process.env.NODE_ENV);
  throw new Error('Oh NO');
});

app.notFound(notFound);
app.onError(onError);
export default app;
