import db from '@/db';
import type {
  CreateRoute,
  GetOneRoute,
  ListRoute,
  PatchRoute,
  RemoveRoute,
} from './medical-history.routes';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import type { AppRouteHandler } from '@/lib/types';
import { medicalHistory } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));

  const result = await db.query.medicalHistory.findMany({
    where: eq(medicalHistory.patientId, patientId),
  });

  return c.json(result);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));
  const data = await c.req.json();
  const [history] = await db
    .insert(medicalHistory)
    .values({ ...data, patientId })
    .returning();
  console.log('MEDICAL HISTORY CREATED', history);

  return c.json(history, HttpStatusCodes.CREATED);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));
  const medicalHistoryId = parseInt(c.req.param('id'));

  const history = await db.query.medicalHistory.findFirst({
    where: and(
      eq(medicalHistory.id, medicalHistoryId),
      eq(medicalHistory.patientId, patientId)
    ),
  });

  if (!history) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(history, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));
  const medicalHistoryId = parseInt(c.req.param('id'));
  const data = await c.req.json();

  const [history] = await db
    .update(medicalHistory)
    .set(data)
    .where(
      and(
        eq(medicalHistory.id, medicalHistoryId),
        eq(medicalHistory.patientId, patientId)
      )
    )
    .returning();

  if (!history) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(history, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));
  const medicalHistoryId = parseInt(c.req.param('id'));
  const result = await db
    .delete(medicalHistory)
    .where(
      and(
        eq(medicalHistory.id, medicalHistoryId),
        eq(medicalHistory.patientId, patientId)
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
