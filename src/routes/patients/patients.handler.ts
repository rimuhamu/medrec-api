import db from '@/db';
import type { CreateRoute, GetOneRoute, ListRoute } from './patients.routes';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
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

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid('param');
  const patient = await db.query.patients.findFirst({
    where(fields, operator) {
      return operator.eq(fields.id, id);
    },
  });

  if (!patient)
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  return c.json(patient, HttpStatusCodes.OK);
};
