import { createRouter } from '@/lib/create-app';
import * as handlers from './patients.handler';
import * as routes from './patients.routes';

const router = createRouter().openapi(routes.list, handlers.list);

export default router;
