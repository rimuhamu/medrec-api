import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';

const tags = ['Patients'];

export const list = createRoute({
  path: '/patients',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(
        z.object({
          name: z.string(),
          done: z.boolean(),
        })
      ),
      'The list of patients'
    ),
  },
});

export type ListRoute = typeof list;
