import {
  insertDiagnosticTestResultsSchema,
  patchDiagnosticTestResultsSchema,
  selectDiagnosticTestResultsSchema,
} from '@/db/schema';
import { notFoundSchema } from '@/lib/constants';
import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import {
  jsonContent,
  jsonContentOneOf,
  jsonContentRequired,
} from 'stoker/openapi/helpers';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';

const tags = ['Diagnostic Test Results'];

export const list = createRoute({
  path: '/patients/{patientId}/diagnostic-test-results',
  method: 'get',
  tags,
  request: {
    params: z.object({
      patientId: z.string().openapi({
        description: 'Patient ID',
        example: '1',
      }),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectDiagnosticTestResultsSchema),
      'The list of diagnostic test results'
    ),
  },
});

export const create = createRoute({
  path: '/patients/{patientId}/diagnostic-test-results',
  method: 'post',
  request: {
    params: z.object({
      patientId: z.string().openapi({
        description: 'Patient ID',
        example: '1',
      }),
    }),
    body: jsonContentRequired(
      insertDiagnosticTestResultsSchema,
      'The diagnostic test results to create'
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectDiagnosticTestResultsSchema,
      'The created diagnostic test result'
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertDiagnosticTestResultsSchema),
      'The validation error'
    ),
  },
});

export const getOne = createRoute({
  path: '/patients/{patientId}/diagnostic-test-results/{id}',
  method: 'get',
  request: {
    params: z.object({
      patientId: z.string().openapi({
        description: 'Patient ID',
        example: '1',
      }),
      id: z.string().openapi({
        description: 'Diagnostic Test Result ID',
        example: '1',
      }),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectDiagnosticTestResultsSchema,
      'The requested diagnostic test result'
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'Diagnostic Test Result not found'
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id error'
    ),
  },
});

export const patch = createRoute({
  path: '/patients/{patientId}/diagnostic-test-results/{id}',
  method: 'patch',
  request: {
    params: z.object({
      patientId: z.string().openapi({
        description: 'Patient ID',
        example: '1',
      }),
      id: z.string().openapi({
        description: 'Diagnostic Test Result ID',
        example: '1',
      }),
    }),
    body: jsonContentRequired(
      patchDiagnosticTestResultsSchema,
      'The diagnostic test result updates'
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectDiagnosticTestResultsSchema,
      'The requested diagnostic test result'
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'Diagnostic Test Result not found'
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [
        createErrorSchema(patchDiagnosticTestResultsSchema),
        createErrorSchema(IdParamsSchema),
      ],
      'Invalid id error'
    ),
  },
});

export const remove = createRoute({
  path: '/patients/{patientId}/diagnostic-test-results/{id}',
  method: 'delete',
  request: {
    params: z.object({
      patientId: z.string().openapi({
        description: 'Patient ID',
        example: '1',
      }),
      id: z.string().openapi({
        description: 'Diagnostic Test Result ID',
        example: '1',
      }),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Diagnostic Test Result deleted',
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'Diagnostic Test Result not found'
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id error'
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
