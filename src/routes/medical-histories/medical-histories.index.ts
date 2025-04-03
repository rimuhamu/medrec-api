import { createRouter } from '@/lib/create-app';
import * as handlers from './medical-histories.handler';
import * as routes from './medical-histories.routes';

const medicalHistoriesRouter = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.patch, handlers.patch)
  .openapi(routes.remove, handlers.remove);

export default medicalHistoriesRouter;
