import {
  insertMedicationsSchema,
  patchMedicationsSchema,
  selectMedicationsSchema,
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

const tags = ['Medications'];

export const list = createRoute({
  path: '/patients/{patientId}/medications',
  method: 'get',
  tags,
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectMedicationsSchema),
      'The list of medications'
    ),
  },
});

export const create = createRoute({
  path: '/patients/{patientId}/medications',
  method: 'post',
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      insertMedicationsSchema,
      'The medications to create'
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectMedicationsSchema,
      'The created medication'
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertMedicationsSchema),
      'The validation error'
    ),
  },
});

export const getOne = createRoute({
  path: '/patients/{patientId}/medications/{id}',
  method: 'get',
  request: {
    params: z.object({
      patientId: IdParamsSchema,
      id: IdParamsSchema,
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectMedicationsSchema,
      'The requested medication'
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'Medication not found'
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id error'
    ),
  },
});

export const patch = createRoute({
  path: '/patients/{patientId}/medications/{id}',
  method: 'patch',
  request: {
    params: z.object({
      patientId: IdParamsSchema,
      id: IdParamsSchema,
    }),
    body: jsonContentRequired(patchMedicationsSchema, 'The medication updates'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectMedicationsSchema,
      'The requested medication'
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'Medication not found'
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [
        createErrorSchema(patchMedicationsSchema),
        createErrorSchema(IdParamsSchema),
      ],
      'Invalid id error'
    ),
  },
});

export const remove = createRoute({
  path: '/patients/{patientId}/medications/{id}',
  method: 'delete',
  request: {
    params: z.object({
      patientId: IdParamsSchema,
      id: IdParamsSchema,
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Medication deleted',
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'Medication not found'
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
