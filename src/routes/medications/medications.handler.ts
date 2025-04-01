import db from '@/db';
import type {
  CreateRoute,
  GetOneRoute,
  ListRoute,
  PatchRoute,
  RemoveRoute,
} from './medications.routes';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import type { AppRouteHandler } from '@/lib/types';
import { medications } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const medications = await db.query.medications.findMany();
  return c.json(medications);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const medication = c.req.valid('json');
  const [inserted] = await db
    .insert(medications)
    .values(medication)
    .returning();
  return c.json(inserted, HttpStatusCodes.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid('param');
  const medication = await db.query.medications.findFirst({
    where(fields, operator) {
      return operator.eq(fields.id, id);
    },
  });

  if (!medication)
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  return c.json(medication, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const { id } = c.req.valid('param');
  const updates = c.req.valid('json');
  const [medication] = await db
    .update(medications)
    .set(updates)
    .where(eq(medications.id, id))
    .returning();

  if (!medication)
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  return c.json(medication, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid('param');
  const result = await db.delete(medications).where(eq(medications.id, id));

  if (result.rowsAffected === 0)
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
