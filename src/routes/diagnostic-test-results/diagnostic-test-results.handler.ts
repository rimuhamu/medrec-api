import db from '@/db';
import type {
  CreateRoute,
  GetOneRoute,
  ListRoute,
  PatchRoute,
  RemoveRoute,
  ExplainRoute,
} from './diagnostic-test-results.routes';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import type { AppRouteHandler } from '@/lib/types';
import { diagnosticTestResult } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { llmService } from '@/services/llm.service';

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));

  const result = await db.query.diagnosticTestResult.findMany({
    where: eq(diagnosticTestResult.patientId, patientId),
  });

  return c.json(result);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));
  const data = await c.req.json();
  console.log('patientId from URL params:', patientId);
  const [newDiagnosticTestResult] = await db
    .insert(diagnosticTestResult)
    .values({ ...data, patientId })
    .returning();
  console.log(patientId, newDiagnosticTestResult.patientId);
  console.log('DIAGNOSTIC TEST RESULT CREATED', newDiagnosticTestResult);

  return c.json(newDiagnosticTestResult, HttpStatusCodes.CREATED);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));
  const diagnosticTestResultId = parseInt(c.req.param('id'));

  const foundDiagnosticTestResult = await db.query.diagnosticTestResult.findFirst({
    where: and(
      eq(diagnosticTestResult.id, diagnosticTestResultId),
      eq(diagnosticTestResult.patientId, patientId)
    ),
  });

  if (!foundDiagnosticTestResult) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(foundDiagnosticTestResult, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));
  const diagnosticTestResultId = parseInt(c.req.param('id'));
  const data = await c.req.json();

  const [updatedDiagnosticTestResult] = await db
    .update(diagnosticTestResult)
    .set(data)
    .where(
      and(
        eq(diagnosticTestResult.id, diagnosticTestResultId),
        eq(diagnosticTestResult.patientId, patientId)
      )
    )
    .returning();

  if (!updatedDiagnosticTestResult) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updatedDiagnosticTestResult, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));
  const diagnosticTestResultId = parseInt(c.req.param('id'));
  const result = await db
    .delete(diagnosticTestResult)
    .where(
      and(
        eq(diagnosticTestResult.id, diagnosticTestResultId),
        eq(diagnosticTestResult.patientId, patientId)
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

export const explain: AppRouteHandler<ExplainRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));
  const diagnosticTestResultId = parseInt(c.req.param('id'));

  // Fetch the test result
  const testResult = await db.query.diagnosticTestResult.findFirst({
    where: and(
      eq(diagnosticTestResult.id, diagnosticTestResultId),
      eq(diagnosticTestResult.patientId, patientId)
    ),
  });

  if (!testResult) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  const explanation = await llmService.generateTestExplanation(testResult);

  return c.json(
    {
      original_result: testResult.result || '',
      explanation: explanation || '',
    },
    HttpStatusCodes.OK
  );
};

