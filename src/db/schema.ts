import { timestamps } from '@/lib/columns.helpers';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

const dateRegex =
  /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;

export const patients = sqliteTable('patients', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  address: text('address').notNull(),
  phoneNumber: text('phone_number').notNull(),
  nextAppointment: text('next_appointment'),
  ...timestamps,
});

export const diagnosticTestResult = sqliteTable('diagnostic_test_result', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  result: text('result'),
  patientId: integer('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  ...timestamps,
});

export const medication = sqliteTable('medication', {
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

export const medicalHistory = sqliteTable('medical_history', {
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

export const selectPatientsSchema = createSelectSchema(patients);

export const insertPatientsSchema = createInsertSchema(patients, {
  name: (schema) => schema.min(1),
  age: (schema) => schema.gte(0).lte(100),
  address: (schema) => schema.min(10),
  phoneNumber: (schema) => schema.startsWith('08').min(10),
  nextAppointment: (schema) => schema.date(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
