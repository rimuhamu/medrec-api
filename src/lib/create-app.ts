import { OpenAPIHono } from '@hono/zod-openapi';
import { notFound, onError } from 'stoker/middlewares';
import { pLogger } from '@/middlewares/pino-logger.ts';

import type { AppBindings } from './types.ts';

export default function createApp() {
  const app = new OpenAPIHono<AppBindings>();

  app.use(pLogger());

  app.notFound(notFound);
  app.onError(onError);
  return app;
}
