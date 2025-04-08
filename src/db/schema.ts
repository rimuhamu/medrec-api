import { timestamps } from '@/lib/columns.helpers';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export const users = sqliteTable('users', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull(), // This will store hashed passwords
  role: text('role').$type<UserRole>().notNull().default(UserRole.USER),
  patientId: integer('patient_id').references(() => patients.id),
  ...timestamps,
});

export const usersRelations = relations(users, ({ one }) => ({
  patient: one(patients, {
    fields: [users.patientId],
    references: [patients.id],
  }),
}));

export const patients = sqliteTable('patients', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  address: text('address').notNull(),
  phoneNumber: text('phone_number').notNull(),
  nextAppointment: text('next_appointment'),
  ...timestamps,
});

export const patientsRelations = relations(patients, ({ many, one }) => ({
  diagnosticTestResults: many(diagnosticTestResults),
  medications: many(medications),
  medicalHistory: many(medicalHistory),
  user: one(users, {
    fields: [patients.id],
    references: [users.patientId],
  }),
}));

export const diagnosticTestResults = sqliteTable('diagnostic_test_result', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  title: text('title'),
  result: text('result'),
  patientId: integer('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  ...timestamps,
});

export const diagnosticTestResultsRelations = relations(
  diagnosticTestResults,
  ({ one }) => ({
    patient: one(patients, {
      fields: [diagnosticTestResults.patientId],
      references: [patients.id],
    }),
  })
);

export const medications = sqliteTable('medication', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name'),
  dosage: text('dosage'),
  frequency: text('frequency'),
  duration: text('duration'),
  patientId: integer('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  ...timestamps,
});

export const medicationsRelations = relations(medications, ({ one }) => ({
  patient: one(patients, {
    fields: [medications.patientId],
    references: [patients.id],
  }),
}));

export const medicalHistory = sqliteTable('medical_history', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  medicalConditions: text('medical_conditions'),
  allergies: text('allergies', { mode: 'json' }).$type<string[]>(), // Store as JSON,
  surgeries: text('surgeries'),
  treatments: text('treatments'),
  patientId: integer('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  ...timestamps,
});

export const medicalHistoryRelations = relations(medicalHistory, ({ one }) => ({
  patient: one(patients, {
    fields: [medicalHistory.patientId],
    references: [patients.id],
  }),
}));

/** USER */

export const selectUsersSchema = createSelectSchema(users).omit({
  password: true,
});

export const insertUsersSchema = createInsertSchema(users, {
  username: (schema) => schema.min(3).max(50),
  password: (schema) => schema.min(8).max(100),
  role: (schema) => schema.optional(),
  patientId: (schema) => schema.optional(),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const patchUsersSchema = insertUsersSchema.partial();

export const loginSchema = insertUsersSchema.pick({
  username: true,
  password: true,
});

/** PATIENT */
export const selectPatientsSchema = createSelectSchema(patients);

export const insertPatientsSchema = createInsertSchema(patients, {
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

export const patchPatientsSchema = insertPatientsSchema.partial();

/** DIAGNOSTIC TEST RESULT */
export const selectDiagnosticTestResultsSchema = createSelectSchema(
  diagnosticTestResults
);

export const insertDiagnosticTestResultsSchema = createInsertSchema(
  diagnosticTestResults,
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

export const patchDiagnosticTestResultsSchema =
  insertDiagnosticTestResultsSchema.partial();

/** MEDICATION */
export const selectMedicationsSchema = createSelectSchema(medications);

export const insertMedicationsSchema = createInsertSchema(medications, {
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

export const patchMedicationsSchema = insertMedicationsSchema.partial();

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
