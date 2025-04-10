import configureOpenAPI from './lib/configure-open-api.ts';
import createApp from './lib/create-app.ts';
import index from '@/routes/index.route';
import patientsRouter from '@/routes/patients/patients.index.ts';
import medicationsRouter from '@/routes/medications/medications.index.ts';
import medicalHistoryRouter from '@/routes/medical-history/medical-history.index.ts';
import diagnosticTestResultsRouter from '@/routes/diagnostic-test-results/diagnostic-test-results.index.ts';
import authRouter from './routes/auth/auth.index.ts';
import {
  adminOnly,
  authenticate,
  userResourceAccess,
} from '@/middlewares/auth.middleware.ts';
import { cors } from 'hono/cors';

const app = createApp();

configureOpenAPI(app);

app.use(
  cors({
    origin: ['http://localhost:3000'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  })
);

// Public routes
app.route('/', index);
app.route('/', authRouter);

// Protected routes
app.use('/patients$', authenticate, adminOnly);

app.use('/patients/:patientId', authenticate, userResourceAccess);

app.route('/', patientsRouter);

app.use('/patients/:patientId/medications*', authenticate, userResourceAccess);

app.route('/', medicationsRouter);

app.use(
  '/patients/:patientId/medical-history*',
  authenticate,
  userResourceAccess
);
app.route('/', medicalHistoryRouter);

app.use(
  '/patients/:patientId/diagnostic-test-results*',
  authenticate,
  userResourceAccess
);
app.route('/', diagnosticTestResultsRouter);

export default app;
