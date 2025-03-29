import { createRouter } from '@/lib/create-app';
import { createRoute } from '@hono/zod-openapi';
import { jsonContent } from 'stoker/openapi/helpers';
import { createMessageObjectSchema } from 'stoker/openapi/schemas';
import * as HttpStatusCodes from 'stoker/http-status-codes';

const router = createRouter().openapi(
  createRoute({
    tags: ['Index'],
    method: 'get',
    path: '/',
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        createMessageObjectSchema('Medrec API'),
        'Medrec API Index'
      ),
    },
  }),
  (c) => {
    return c.json(
      {
        message: 'Medrec API',
      },
      HttpStatusCodes.OK
    );
  }
);

export default router;
