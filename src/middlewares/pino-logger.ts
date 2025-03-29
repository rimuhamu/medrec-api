import env from '@/env.ts';
import { pinoLogger } from 'hono-pino';
import pino from 'pino';
import pretty from 'pino-pretty';

export function pLogger() {
  return pinoLogger({
    pino: pino(
      {
        level: env.LOG_LEVEL || 'info',
      },
      process.env.NODE_ENV === 'production' ? undefined : pretty()
    ),
    http: {
      reqId: () => crypto.randomUUID(),
    },
  });
}
