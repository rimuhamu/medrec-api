import { timestamps } from '@/lib/columns.helpers';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const patients = sqliteTable('patients', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  address: text('address').notNull(),
  phoneNumber: text('phone_number').notNull(),
  nextAppointment: text('next_appointment'),
  ...timestamps,
});

export const diagnosticTestResults = sqliteTable('diagnostic_test_result', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  result: text('result'),
  patientId: integer('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  ...timestamps,
});

export const medications = sqliteTable('medication', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name'),
  dosage: text('dosage'),
  frequency: text('frequency'),
  duration: text('duration'),
  patientId: integer('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  ...timestamps,
});

export const medicalHistories = sqliteTable('medical_history', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  medicalConditions: text('medical_conditions'),
  allergies: text('allergies'),
  surgeries: text('surgeries'),
  treatments: text('treatments'),
  patientId: integer('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  ...timestamps,
});

/** PATIENTS */
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

/** MEDICATION */
export const selectMedicationsSchema = createSelectSchema(medications);

export const insertMedicationsSchema = createInsertSchema(medications, {
  name: (schema) => schema.min(1),
  dosage: (schema) => schema.min(1),
  frequency: (schema) => schema.min(1),
  duration: (schema) => schema.min(1),
  patientId: (schema) => schema.int().positive(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const patchMedicationsSchema = insertMedicationsSchema.partial();
