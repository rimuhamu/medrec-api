import { createRouter } from '@/lib/create-app';
import * as handlers from './auth.handler';
import * as routes from './auth.routes';
import { authenticate, adminOnly } from '@/middleware/auth.middleware';

const authRouter = createRouter()
  .openapi(routes.register, handlers.register)
  .openapi(
    routes.registerAdmin,
    [authenticate, adminOnly],
    handlers.registerAdmin
  )
  .openapi(routes.login, handlers.login)
  .openapi(routes.me, authenticate, handlers.me);

export default authRouter;
