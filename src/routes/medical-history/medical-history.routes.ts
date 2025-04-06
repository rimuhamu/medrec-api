import {
  insertMedicalHistorySchema,
  patchMedicalHistorySchema,
  selectMedicalHistorySchema,
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

const tags = ['Medical History'];

export const list = createRoute({
  path: '/patients/{patientId}/medical-history',
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
      z.array(selectMedicalHistorySchema),
      'The list of medical history'
    ),
  },
});

export const create = createRoute({
  path: '/patients/{patientId}/medical-history',
  method: 'post',
  request: {
    params: z.object({
      patientId: z.string().openapi({
        description: 'Patient ID',
        example: '1',
      }),
    }),
    body: jsonContentRequired(
      insertMedicalHistorySchema,
      'The medical history to create'
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectMedicalHistorySchema,
      'The created medical history'
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertMedicalHistorySchema),
      'The validation error'
    ),
  },
});

export const getOne = createRoute({
  path: '/patients/{patientId}/medical-history/{id}',
  method: 'get',
  request: {
    params: z.object({
      patientId: z.string().openapi({
        description: 'Patient ID',
        example: '1',
      }),
      id: z.string().openapi({
        description: 'Medical History ID',
        example: '1',
      }),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectMedicalHistorySchema,
      'The requested medical history'
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'Medical History not found'
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id error'
    ),
  },
});

export const patch = createRoute({
  path: '/patients/{patientId}/medical-history/{id}',
  method: 'patch',
  request: {
    params: z.object({
      patientId: z.string().openapi({
        description: 'Patient ID',
        example: '1',
      }),
      id: z.string().openapi({
        description: 'Medical History ID',
        example: '1',
      }),
    }),
    body: jsonContentRequired(
      patchMedicalHistorySchema,
      'The medical history updates'
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectMedicalHistorySchema,
      'The requested medical history'
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'Medical History not found'
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [
        createErrorSchema(patchMedicalHistorySchema),
        createErrorSchema(IdParamsSchema),
      ],
      'Invalid id error'
    ),
  },
});

export const remove = createRoute({
  path: '/patients/{patientId}/medical-history/{id}',
  method: 'delete',
  request: {
    params: z.object({
      patientId: z.string().openapi({
        description: 'Patient ID',
        example: '1',
      }),
      id: z.string().openapi({
        description: 'Medical History ID',
        example: '1',
      }),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Medical History deleted',
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'Medical History not found'
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
