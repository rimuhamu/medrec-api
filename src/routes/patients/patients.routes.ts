import {
  insertPatientsSchema,
  patchPatientsSchema,
  selectPatientsSchema,
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

const tags = ['Patients'];

export const list = createRoute({
  path: '/patients',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectPatientsSchema),
      'The list of patients'
    ),
  },
});

export const create = createRoute({
  path: '/patients',
  method: 'post',
  request: {
    body: jsonContentRequired(insertPatientsSchema, 'The patients to create'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectPatientsSchema,
      'The selected patient'
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertPatientsSchema),
      'The validation error'
    ),
  },
});

export const getOne = createRoute({
  path: '/patients/{id}',
  method: 'get',
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectPatientsSchema,
      'The requested patient'
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'Patient not found'
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id error'
    ),
  },
});

export const patch = createRoute({
  path: '/patients/{id}',
  method: 'patch',
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(patchPatientsSchema, 'The patient updates'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectPatientsSchema,
      'The requested patient'
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'Patient not found'
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [
        createErrorSchema(patchPatientsSchema),
        createErrorSchema(IdParamsSchema),
      ],
      'Invalid id error'
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
