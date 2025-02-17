import { createRouter } from '@/lib/create-app';
import { createRoute } from '@hono/zod-openapi';
import { jsonContent } from 'stoker/openapi/helpers';
import { createMessageObjectSchema } from 'stoker/openapi/schemas';

const router = createRouter().openapi(
  createRoute({
    tags: ['Index'],
    method: 'get',
    path: '/',
    responses: {
      200: jsonContent(
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
      200
    );
  }
);

export default router;
