import { OpenAPIHono } from '@hono/zod-openapi';
import { notFound, onError } from 'stoker/middlewares';
import { pLogger } from '@/middlewares/pino-logger.ts';

import type { AppBindings } from './types.ts';

export function createRouter() {
  return new OpenAPIHono<AppBindings>({ strict: false });
}

export default function createApp() {
  const app = createRouter();

  app.notFound(notFound);
  app.onError(onError);
  return app;
}
