import { timestamps } from '@/lib/columns.helpers';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export const user = sqliteTable('users', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull(), // This will store hashed passwords
  role: text('role').$type<UserRole>().notNull().default(UserRole.USER),
  patientId: integer('patient_id').references(() => patient.id),
  ...timestamps,
});

export const userRelations = relations(user, ({ one }) => ({
  patient: one(patient, {
    fields: [user.patientId],
    references: [patient.id],
  }),
}));

export const patient = sqliteTable('patients', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  address: text('address').notNull(),
  phoneNumber: text('phone_number').notNull(),
  nextAppointment: text('next_appointment'),
  ...timestamps,
});

export const patientRelations = relations(patient, ({ many, one }) => ({
  diagnosticTestResults: many(diagnosticTestResult),
  medications: many(medication),
  medicalHistory: many(medicalHistory),
  user: one(user, {
    fields: [patient.id],
    references: [user.patientId],
  }),
}));

export const diagnosticTestResult = sqliteTable('diagnostic_test_results', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  title: text('title'),
  result: text('result'),
  patientId: integer('patient_id')
    .notNull()
    .references(() => patient.id, { onDelete: 'cascade' }),
  ...timestamps,
});

export const diagnosticTestResultRelations = relations(
  diagnosticTestResult,
  ({ one }) => ({
    patient: one(patient, {
      fields: [diagnosticTestResult.patientId],
      references: [patient.id],
    }),
  })
);

export const medication = sqliteTable('medications', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name'),
  dosage: text('dosage'),
  frequency: text('frequency'),
  duration: text('duration'),
  patientId: integer('patient_id')
    .notNull()
    .references(() => patient.id, { onDelete: 'cascade' }),
  ...timestamps,
});

export const medicationRelations = relations(medication, ({ one }) => ({
  patient: one(patient, {
    fields: [medication.patientId],
    references: [patient.id],
  }),
}));

export const medicalHistory = sqliteTable('medical_histories', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  medicalConditions: text('medical_conditions'),
  allergies: text('allergies', { mode: 'json' }).$type<string[]>(), // Store as JSON,
  surgeries: text('surgeries'),
  treatments: text('treatments'),
  patientId: integer('patient_id')
    .notNull()
    .references(() => patient.id, { onDelete: 'cascade' }),
  ...timestamps,
});

export const medicalHistoryRelations = relations(medicalHistory, ({ one }) => ({
  patient: one(patient, {
    fields: [medicalHistory.patientId],
    references: [patient.id],
  }),
}));

/** USER */

export const selectUserSchema = createSelectSchema(user).omit({
  password: true,
});

export const insertUserSchema = createInsertSchema(user, {
  username: (schema) => schema.min(3).max(50),
  password: (schema) => schema.min(8).max(100),
  role: (schema) => schema.optional(),
  patientId: (schema) => schema.optional(),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const patchUserSchema = insertUserSchema.partial();

export const loginSchema = insertUserSchema.pick({
  username: true,
  password: true,
});

/** PATIENT */
export const selectPatientSchema = createSelectSchema(patient);

export const insertPatientSchema = createInsertSchema(patient, {
  name: (schema) => schema.min(1),
  age: (schema) => schema.gte(0).lte(100),
  address: (schema) => schema.min(10),
  phoneNumber: (schema) => schema.startsWith('08').min(10),
  nextAppointment: (schema) => schema.date(), //ex: "2025-05-29"
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const patchPatientSchema = insertPatientSchema.partial();

/** DIAGNOSTIC TEST RESULT */
export const selectDiagnosticTestResultSchema = createSelectSchema(
  diagnosticTestResult
);

export const insertDiagnosticTestResultSchema = createInsertSchema(
  diagnosticTestResult,
  {
    title: (schema) => schema.min(1).max(30),
    result: (schema) => schema.min(1).max(300),
  }
).omit({
  id: true,
  patientId: true,
  createdAt: true,
  updatedAt: true,
});

export const patchDiagnosticTestResultSchema =
  insertDiagnosticTestResultSchema.partial();

/** MEDICATION */
export const selectMedicationSchema = createSelectSchema(medication);

export const insertMedicationSchema = createInsertSchema(medication, {
  name: (schema) => schema.min(1),
  dosage: (schema) => schema.min(1),
  frequency: (schema) => schema.min(1),
  duration: (schema) => schema.min(1),
}).omit({
  id: true,
  patientId: true,
  createdAt: true,
  updatedAt: true,
});

export const patchMedicationSchema = insertMedicationSchema.partial();

/** MEDICAL HISTORY */
export const selectMedicalHistorySchema = createSelectSchema(medicalHistory);

export const insertMedicalHistorySchema = createInsertSchema(medicalHistory, {
  medicalConditions: (schema) => schema.min(1).max(50),
  allergies: (schema) => schema.array().nonempty(),
  surgeries: (schema) => schema.min(1).max(50),
  treatments: (schema) => schema.min(1).max(50),
}).omit({
  id: true,
  patientId: true,
  createdAt: true,
  updatedAt: true,
});

export const patchMedicalHistorySchema = insertMedicalHistorySchema.partial();
