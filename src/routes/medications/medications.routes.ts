import {
  insertMedicationSchema,
  patchMedicationSchema,
  selectMedicationSchema,
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

// Schedule response schema - supports structured JSON or text fallback
const scheduleItemSchema = z.object({
  time_of_day: z.string(),
  medicines: z.array(z.string()),
});

const scheduleResponseSchema = z.object({
  schedule: z.union([z.array(scheduleItemSchema), z.string()]),
});

export const list = createRoute({
  path: '/patients/{patientId}/medications',
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
      z.array(selectMedicationSchema),
      'The list of medications'
    ),
  },
});

export const create = createRoute({
  path: '/patients/{patientId}/medications',
  method: 'post',
  request: {
    params: z.object({
      patientId: z.string().openapi({
        description: 'Patient ID',
        example: '1',
      }),
    }),
    body: jsonContentRequired(
      insertMedicationSchema,
      'The medications to create'
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectMedicationSchema,
      'The created medication'
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertMedicationSchema),
      'The validation error'
    ),
  },
});

export const getOne = createRoute({
  path: '/patients/{patientId}/medications/{id}',
  method: 'get',
  request: {
    params: z.object({
      patientId: z.string().openapi({
        description: 'Patient ID',
        example: '1',
      }),
      id: z.string().openapi({
        description: 'Medication ID',
        example: '1',
      }),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectMedicationSchema,
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
      patientId: z.string().openapi({
        description: 'Patient ID',
        example: '1',
      }),
      id: z.string().openapi({
        description: 'Medication ID',
        example: '1',
      }),
    }),
    body: jsonContentRequired(patchMedicationSchema, 'The medication updates'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectMedicationSchema,
      'The requested medication'
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'Medication not found'
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [
        createErrorSchema(patchMedicationSchema),
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
      patientId: z.string().openapi({
        description: 'Patient ID',
        example: '1',
      }),
      id: z.string().openapi({
        description: 'Medication ID',
        example: '1',
      }),
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

export const schedule = createRoute({
  path: '/patients/{patientId}/medications/schedule',
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
      scheduleResponseSchema,
      'AI-generated daily medication schedule'
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
export type ScheduleRoute = typeof schedule;
