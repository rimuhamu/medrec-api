/* eslint-disable no-console */
import { serve } from '@hono/node-server';
import app from './app.ts';
import env from './env.ts';

const port = Number(env.PORT || 3000);
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
