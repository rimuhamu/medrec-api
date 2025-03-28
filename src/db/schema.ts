import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const patients = sqliteTable('patients', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age'),
  address: text('address').notNull(),
  phoneNumber: integer('phone_numnber').notNull(),
  nextAppointment: text('next_appointment'),
});

export const diagnosticTestResult = sqliteTable('diagnostic_test_result', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  result: text('result'),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updateAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(
    () => new Date()
  ),
  patientId: integer('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
});

export const medication = sqliteTable('medication', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name'),
  dosage: text('dosage'),
  frequency: text('frequency'),
  duration: text('duration'),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  patientId: integer('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
});

export const medicalHistory = sqliteTable('medical_history', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  medicalConditions: text('medical_conditions'),
  allergies: text('allergies'),
  surgeries: text('surgeries'),
  treatments: text('treatments'),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  patientId: integer('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
});
