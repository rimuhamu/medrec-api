import db from '@/db';
import type {
  CreateRoute,
  GetOneRoute,
  ListRoute,
  PatchRoute,
  RemoveRoute,
  ScheduleRoute,
} from './medications.routes';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import type { AppRouteHandler } from '@/lib/types';
import { medication } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { llmService } from '@/services/llm.service';

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));

  const result = await db.query.medication.findMany({
    where: eq(medication.patientId, patientId),
  });

  return c.json(result);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));
  const data = await c.req.json();
  console.log(patientId);
  const [newMedication] = await db
    .insert(medication)
    .values({ ...data, patientId })
    .returning();
  console.log('MEDICATION CREATED');

  return c.json(newMedication, HttpStatusCodes.CREATED);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));
  const medicationId = parseInt(c.req.param('id'));

  const foundMedication = await db.query.medication.findFirst({
    where: and(
      eq(medication.id, medicationId),
      eq(medication.patientId, patientId)
    ),
  });

  if (!foundMedication) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(foundMedication, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));
  const medicationId = parseInt(c.req.param('id'));
  const data = await c.req.json();

  const [updatedMedication] = await db
    .update(medication)
    .set(data)
    .where(
      and(
        eq(medication.id, medicationId),
        eq(medication.patientId, patientId)
      )
    )
    .returning();

  if (!updatedMedication) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updatedMedication, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));
  const medicationId = parseInt(c.req.param('id'));
  const result = await db
    .delete(medication)
    .where(
      and(
        eq(medication.id, medicationId),
        eq(medication.patientId, patientId)
      )
    );

  if (result.rowsAffected === 0)
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

export const schedule: AppRouteHandler<ScheduleRoute> = async (c) => {
  const patientId = parseInt(c.req.param('patientId'));

  const patientMedications = await db.query.medication.findMany({
    where: eq(medication.patientId, patientId),
  });

  if (patientMedications.length === 0) {
    return c.json({ schedule: [] }, HttpStatusCodes.OK);
  }

  const medsData = patientMedications.map((med) => ({
    name: med.name || 'Unknown',
    dosage: med.dosage || 'As prescribed',
    frequency: med.frequency || 'As needed',
  }));

  const llmResponse = await llmService.generateSchedule(JSON.stringify(medsData));

  // Parse as JSON, fallback to text
  type ScheduleItem = { time_of_day: string; medicines: string[] };
  let scheduleResult: ScheduleItem[] | string;

  if(llmResponse){
    scheduleResult = JSON.parse(llmResponse) as ScheduleItem[];
  }else{
    console.error("LLM returned invalid JSON");
    scheduleResult = [];
  }


  return c.json({ schedule: scheduleResult }, HttpStatusCodes.OK);
};

