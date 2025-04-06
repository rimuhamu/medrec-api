import { createRouter } from '@/lib/create-app';
import * as handlers from './medical-history.handler';
import * as routes from './medical-history.routes';

const medicalHistoryRouter = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.patch, handlers.patch)
  .openapi(routes.remove, handlers.remove);

export default medicalHistoryRouter;
