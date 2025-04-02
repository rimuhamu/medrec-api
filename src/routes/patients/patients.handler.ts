import db from '@/db';
import type {
  CreateRoute,
  GetOneRoute,
  ListRoute,
  PatchRoute,
  RemoveRoute,
} from './patients.routes';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import type { AppRouteHandler } from '@/lib/types';
import { patients } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const patients = await db.query.patients.findMany();
  return c.json(patients);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const patient = c.req.valid('json');
  const [inserted] = await db.insert(patients).values(patient).returning();
  return c.json(inserted, HttpStatusCodes.CREATED);
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

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const { id } = c.req.valid('param');
  const updates = c.req.valid('json');
  const [patient] = await db
    .update(patients)
    .set(updates)
    .where(eq(patients.id, id))
    .returning();

  if (!patient)
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  return c.json(patient, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid('param');
  const result = await db.delete(patients).where(eq(patients.id, id));

  if (result.rowsAffected === 0)
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
