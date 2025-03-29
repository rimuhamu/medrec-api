import configureOpenAPI from './lib/configure-open-api.ts';
import createApp from './lib/create-app.ts';
import index from '@/routes/index.route';
import patients from '@/routes/patients/patients.index.ts';

const app = createApp();

const routes = [index, patients];

configureOpenAPI(app);
routes.forEach((route) => {
  app.route('/', route);
});

export default app;
