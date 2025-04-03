import configureOpenAPI from './lib/configure-open-api.ts';
import createApp from './lib/create-app.ts';
import index from '@/routes/index.route';
import patientsRouter from '@/routes/patients/patients.index.ts';
import medicationsRouter from '@/routes/medications/medications.index.ts';
import medicalHistoriesRouter from '@/routes/medical-histories/medical-histories.index.ts';

const app = createApp();

const routes = [
  index,
  patientsRouter,
  medicationsRouter,
  medicalHistoriesRouter,
];

configureOpenAPI(app);
routes.forEach((route) => {
  app.route('/', route);
});

export default app;
