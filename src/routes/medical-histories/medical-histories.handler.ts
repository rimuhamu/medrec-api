import db from '@/db';
import type {
  CreateRoute,
  GetOneRoute,
  ListRoute,
  PatchRoute,
  RemoveRoute,
} from './medical-histories.routes';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import type { AppRouteHandler } from '@/lib/types';
import { medicalHistories } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));

  const result = await db.query.medicalHistories.findMany({
    where: eq(medicalHistories.patientId, patientId),
  });

  return c.json(result);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));
  const data = await c.req.json();
  const [medicalHistory] = await db
    .insert(medicalHistories)
    .values({ ...data, patientId })
    .returning();
  console.log('MEDICAL HISTORY CREATED', medicalHistory);

  return c.json(medicalHistory, HttpStatusCodes.CREATED);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));
  const medicalHistoryId = parseInt(c.req.param('id'));

  const medicalHistory = await db.query.medicalHistories.findFirst({
    where: and(
      eq(medicalHistories.id, medicalHistoryId),
      eq(medicalHistories.patientId, patientId)
    ),
  });

  if (!medicalHistory) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(medicalHistory, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));
  const medicalHistoryId = parseInt(c.req.param('id'));
  const data = await c.req.json();

  const [medicalHistory] = await db
    .update(medicalHistories)
    .set(data)
    .where(
      and(
        eq(medicalHistories.id, medicalHistoryId),
        eq(medicalHistories.patientId, patientId)
      )
    )
    .returning();

  if (!medicalHistory) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(medicalHistory, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));
  const medicalHistoryId = parseInt(c.req.param('id'));
  const result = await db
    .delete(medicalHistories)
    .where(
      and(
        eq(medicalHistories.id, medicalHistoryId),
        eq(medicalHistories.patientId, patientId)
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
