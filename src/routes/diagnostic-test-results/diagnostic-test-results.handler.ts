import db from '@/db';
import type {
  CreateRoute,
  GetOneRoute,
  ListRoute,
  PatchRoute,
  RemoveRoute,
} from './diagnostic-test-results.routes';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import type { AppRouteHandler } from '@/lib/types';
import { diagnosticTestResults } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));

  const result = await db.query.diagnosticTestResults.findMany({
    where: eq(diagnosticTestResults.patientId, patientId),
  });

  return c.json(result);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));
  const data = await c.req.json();
  console.log(patientId);
  const [diagnosticTestResult] = await db
    .insert(diagnosticTestResults)
    .values({ ...data, patientId })
    .returning();
  console.log('DIAGNOSTIC TEST RESULT CREATED', diagnosticTestResult);

  return c.json(diagnosticTestResult, HttpStatusCodes.CREATED);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));
  const diagnosticTestResultId = parseInt(c.req.param('id'));

  const diagnosticTestResult = await db.query.diagnosticTestResults.findFirst({
    where: and(
      eq(diagnosticTestResults.id, diagnosticTestResultId),
      eq(diagnosticTestResults.patientId, patientId)
    ),
  });

  if (!diagnosticTestResult) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(diagnosticTestResult, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));
  const diagnosticTestResultId = parseInt(c.req.param('id'));
  const data = await c.req.json();

  const [diagnosticTestResult] = await db
    .update(diagnosticTestResults)
    .set(data)
    .where(
      and(
        eq(diagnosticTestResults.id, diagnosticTestResultId),
        eq(diagnosticTestResults.patientId, patientId)
      )
    )
    .returning();

  if (!diagnosticTestResult) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(diagnosticTestResult, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));
  const diagnosticTestResultId = parseInt(c.req.param('id'));
  const result = await db
    .delete(diagnosticTestResults)
    .where(
      and(
        eq(diagnosticTestResults.id, diagnosticTestResultId),
        eq(diagnosticTestResults.patientId, patientId)
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
