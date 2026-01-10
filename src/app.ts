import configureOpenAPI from "./lib/configure-open-api.ts";
import createApp from "./lib/create-app.ts";
import health from "@/routes/health.route.ts";
import patientsRouter from "@/routes/patients/patients.index.ts";
import medicationsRouter from "@/routes/medications/medications.index.ts";
import medicalHistoryRouter from "@/routes/medical-history/medical-history.index.ts";
import diagnosticTestResultsRouter from "@/routes/diagnostic-test-results/diagnostic-test-results.index.ts";
import authRouter from "./routes/auth/auth.index.ts";
import {
  adminOnly,
  authenticate,
  userResourceAccess,
} from "@/middlewares/auth.middleware.ts";
import { cors } from "hono/cors";
import env from "./env.ts";

const app = createApp();

configureOpenAPI(app);

app.use(
  cors({
    origin: [env.CORS_ORIGIN],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

// Public routes
app.route("/", health);
app.route("/", authRouter);

// Protected routes
const protectedApp = createApp();

// Apply authentication middleware to all protected routes
protectedApp.use("*", authenticate);

// Register patient management routes (admin only)
protectedApp.use("/patients", adminOnly);
protectedApp.route("/", patientsRouter);

// Register patient sub-resource routes with resource access control
protectedApp.use("/patients/:patientId/*", userResourceAccess);
protectedApp.route("/", medicationsRouter);
protectedApp.route("/", medicalHistoryRouter);
protectedApp.route("/", diagnosticTestResultsRouter);

// Mount the protected routes
app.route("/", protectedApp);

export default app;
