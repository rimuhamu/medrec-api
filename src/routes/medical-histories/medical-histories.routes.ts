import {
  insertMedicalHistoriesSchema,
  patchMedicalHistoriesSchema,
  selectMedicalHistoriesSchema,
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

const tags = ['Medical Histories'];

export const list = createRoute({
  path: '/patients/{patientId}/medical-histories',
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
      z.array(selectMedicalHistoriesSchema),
      'The list of medical histories'
    ),
  },
});

export const create = createRoute({
  path: '/patients/{patientId}/medical-histories',
  method: 'post',
  request: {
    params: z.object({
      patientId: z.string().openapi({
        description: 'Patient ID',
        example: '1',
      }),
    }),
    body: jsonContentRequired(
      insertMedicalHistoriesSchema,
      'The medical histories to create'
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectMedicalHistoriesSchema,
      'The created medical history'
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertMedicalHistoriesSchema),
      'The validation error'
    ),
  },
});

export const getOne = createRoute({
  path: '/patients/{patientId}/medical-histories/{id}',
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
      selectMedicalHistoriesSchema,
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
  path: '/patients/{patientId}/medical-histories/{id}',
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
      patchMedicalHistoriesSchema,
      'The medical history updates'
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectMedicalHistoriesSchema,
      'The requested medical history'
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'Medical History not found'
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [
        createErrorSchema(patchMedicalHistoriesSchema),
        createErrorSchema(IdParamsSchema),
      ],
      'Invalid id error'
    ),
  },
});

export const remove = createRoute({
  path: '/patients/{patientId}/medical-histories/{id}',
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
