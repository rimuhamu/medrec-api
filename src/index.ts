/* eslint-disable no-console */
import { serve } from '@hono/node-server';
import app from './app.js';
import { config } from 'dotenv';

config();

const port = Number(process.env.PORT || 3000);
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
