import { config } from 'dotenv';
import { pinoLogger } from 'hono-pino';
import pino from 'pino';
import pretty from 'pino-pretty';

config();

export function pLogger() {
  return pinoLogger({
    pino: pino.default(
      {
        level: process.env.LOG_LEVEL || 'info',
      },
      process.env.NODE_ENV === 'production' ? undefined : pretty()
    ),
    http: {
      reqId: () => crypto.randomUUID(),
    },
  });
}
