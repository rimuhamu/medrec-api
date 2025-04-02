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
import { and, eq } from 'drizzle-orm';

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));

  const result = await db.query.medications.findMany({
    where: eq(medications.patientId, patientId),
  });

  return c.json(result);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));
  const data = await c.req.json();

  const [medication] = await db
    .insert(medications)
    .values({ ...data, patientId })
    .returning();

  return c.json(medication, HttpStatusCodes.CREATED);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));
  const medicationId = parseInt(c.req.param('id'));

  const medication = await db.query.medications.findFirst({
    where: and(
      eq(medications.id, medicationId),
      eq(medications.patientId, patientId)
    ),
  });

  if (!medication) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(medication, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));
  const medicationId = parseInt(c.req.param('id'));
  const data = await c.req.json();

  const [medication] = await db
    .update(medications)
    .set(data)
    .where(
      and(
        eq(medications.id, medicationId),
        eq(medications.patientId, patientId)
      )
    )
    .returning();

  if (!medication) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(medication, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));
  const medicationId = parseInt(c.req.param('id'));
  const result = await db
    .delete(medications)
    .where(
      and(
        eq(medications.id, medicationId),
        eq(medications.patientId, patientId)
      )
    );

  if (result.rowsAffected === 0)
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
