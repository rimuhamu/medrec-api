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
import { patient } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const allPatients = await db.query.patient.findMany();
  return c.json(allPatients);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const patientData = await c.req.json();
  const [inserted] = await db.insert(patient).values(patientData).returning();
  return c.json(inserted, HttpStatusCodes.CREATED);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const id = parseInt(c.req.param('id'));
  const foundPatient = await db.query.patient.findFirst({
    where(fields, operator) {
      return operator.eq(fields.id, id);
    },
  });

  if (!foundPatient)
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  return c.json(foundPatient, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const id = parseInt(c.req.param('id'));
  const updates = await c.req.json();
  const [updatedPatient] = await db
    .update(patient)
    .set(updates)
    .where(eq(patient.id, id))
    .returning();

  if (!updatedPatient)
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  return c.json(updatedPatient, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const id = parseInt(c.req.param('id'));
  const result = await db.delete(patient).where(eq(patient.id, id));

  if (result.rowsAffected === 0)
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
