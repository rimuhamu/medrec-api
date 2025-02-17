import configureOpenAPI from './lib/configure-open-api.ts';
import createApp from './lib/create-app.ts';
import index from '@/routes/index.route';

const app = createApp();

const routes = [index];

configureOpenAPI(app);
routes.forEach((route) => {
  app.route('/', route);
});

export default app;
