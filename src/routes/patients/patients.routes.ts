import { insertPatientsSchema, selectPatientsSchema } from '@/db/schema';
import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema } from 'stoker/openapi/schemas';

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
      'The created patients'
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertPatientsSchema),
      'The validation error'
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
