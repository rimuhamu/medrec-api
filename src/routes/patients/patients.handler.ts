import db from '@/db';
import type { CreateRoute, ListRoute } from './patients.routes';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import type { AppRouteHandler } from '@/lib/types';
import { patients } from '@/db/schema';

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const patients = await db.query.patients.findMany();
  return c.json(patients);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const patient = c.req.valid('json');
  const [inserted] = await db.insert(patients).values(patient).returning();
  return c.json(inserted, HttpStatusCodes.OK);
};
