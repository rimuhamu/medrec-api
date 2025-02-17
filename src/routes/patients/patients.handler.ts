import type { ListRoute } from './patients.routes';
import type { AppRouteHandler } from '@/lib/types';

export const list: AppRouteHandler<ListRoute> = (c) => {
  return c.json([
    {
      name: 'ops',
      done: false,
    },
  ]);
};
