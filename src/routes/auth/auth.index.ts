import { createRouter } from '@/lib/create-app';
import * as handlers from './auth.handler';
import * as routes from './auth.routes';
import { authenticate, adminOnly } from '@/middlewares/auth.middleware';

const authRouter = createRouter();

authRouter.openapi(routes.register, handlers.register);
authRouter.openapi(routes.login, handlers.login);

authRouter.use('/auth/register-admin', authenticate);
authRouter.use('/auth/register-admin', adminOnly);
authRouter.openapi(routes.registerAdmin, handlers.registerAdmin);

authRouter.use('/auth/profile', authenticate);
authRouter.openapi(routes.profile, handlers.profile);

export default authRouter;
