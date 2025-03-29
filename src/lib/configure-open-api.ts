import type { AppOpenAPI } from './types.ts';

import packageJSON from '../../package.json';
import { apiReference } from '@scalar/hono-api-reference';

export default function configureOpenAPI(app: AppOpenAPI) {
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      version: packageJSON.version,
      title: 'Medrec API',
    },
  });

  app.get(
    '/reference',
    apiReference({
      theme: 'kepler',
      layout: 'classic',
      spec: {
        url: '/doc',
      },
    })
  );
}
