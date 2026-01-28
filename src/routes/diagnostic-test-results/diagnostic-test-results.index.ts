import { createRouter } from '@/lib/create-app';
import * as handlers from './diagnostic-test-results.handler';
import * as routes from './diagnostic-test-results.routes';

const diagnosticTestResultsRouter = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.patch, handlers.patch)
  .openapi(routes.remove, handlers.remove)
  .openapi(routes.explain, handlers.explain);

export default diagnosticTestResultsRouter;

