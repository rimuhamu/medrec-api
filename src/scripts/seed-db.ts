import { authService } from "@/services/auth.service";
import db from "@/db";
import {
  users,
  patients,
  medications,
  medicalHistory,
  diagnosticTestResults,
} from "@/db/schema";
import { sql } from "drizzle-orm";

const patientsData = [
  {
    name: "John Smith",
    age: 35,
    address: "123 Oak Street, Springfield, IL 62701",
    phoneNumber: "08123456789",
    nextAppointment: "2026-01-22",
  },
  {
    name: "Sarah Johnson",
    age: 42,
    address: "456 Maple Avenue, Chicago, IL 60601",
    phoneNumber: "08234567890",
    nextAppointment: "2025-09-20",
  },
  {
    name: "Michael Davis",
    age: 28,
    address: "789 Pine Road, Peoria, IL 61602",
    phoneNumber: "08345678901",
    nextAppointment: "2025-09-18",
  },
  {
    name: "Emily Wilson",
    age: 67,
    address: "321 Elm Circle, Rockford, IL 61101",
    phoneNumber: "08456789012",
    nextAppointment: "2025-09-22",
  },
];

const medicationsData = [
  [
    {
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily in the morning",
      duration: "6 months",
    },
    {
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily with breakfast and dinner",
      duration: "1 month",
    },
  ],
  [
    {
      name: "Atorvastatin",
      dosage: "20mg",
      frequency: "Once daily at bedtime",
      duration: "12 months",
    },
    {
      name: "Levothyroxine",
      dosage: "75mcg",
      frequency: "Once daily before breakfast on empty stomach",
      duration: "1 month",
    },
  ],
  [
    {
      name: "Albuterol",
      dosage: "90mcg",
      frequency: "As needed for breathing difficulty",
      duration: "12 months",
    },
  ],
  [
    {
      name: "Amlodipine",
      dosage: "5mg",
      frequency: "Once daily in the morning",
      duration: "Ongoing",
    },
    {
      name: "Warfarin",
      dosage: "5mg",
      frequency: "Once daily in the evening",
      duration: "6 months",
    },
    {
      name: "Furosemide",
      dosage: "40mg",
      frequency: "Twice daily in the morning and afternoon",
      duration: "3 months",
    },
  ],
];

const medicalHistoryData = [
  {
    medicalConditions: "Type 2 Diabetes, Hypertension",
    allergies: ["Penicillin", "Shellfish"],
    surgeries: "Appendectomy (2010)",
    treatments: "Dietary counseling, Regular exercise program",
  },
  {
    medicalConditions: "Hypothyroidism, High Cholesterol",
    allergies: ["Latex"],
    surgeries: "Gallbladder removal (2018)",
    treatments: "Annual thyroid monitoring, Lipid management",
  },
  {
    medicalConditions: "Asthma",
    allergies: ["Dust mites", "Pollen"],
    surgeries: "None",
    treatments: "Allergen avoidance, Pulmonary function tests",
  },
  {
    medicalConditions: "Atrial Fibrillation, Congestive Heart Failure",
    allergies: ["Aspirin"],
    surgeries: "Hip replacement (2020), Cataract surgery (2022)",
    treatments: "Cardiac rehabilitation, Regular INR monitoring",
  },
];

const diagnosticTestResultsData = [
  [
    {
      title: "HbA1c Test",
      result:
        "HbA1c: 7.2% (target <7%). Blood glucose control needs improvement. Continue current medications and increase exercise frequency.",
    },
    {
      title: "Blood Pressure Reading",
      result:
        "BP: 140/85 mmHg. Slightly elevated. Consider medication adjustment if readings remain high.",
    },
  ],
  [
    {
      title: "Lipid Panel",
      result:
        "Total cholesterol: 195 mg/dL, LDL: 115 mg/dL, HDL: 58 mg/dL, Triglycerides: 110 mg/dL. Improved from previous results.",
    },
    {
      title: "TSH Test",
      result:
        "TSH: 2.1 mIU/L (normal range). Thyroid function stable on current medication.",
    },
  ],
  [
    {
      title: "Pulmonary Function Test",
      result:
        "FEV1: 85% predicted. Mild obstruction noted. Asthma well-controlled with current therapy.",
    },
  ],
  [
    {
      title: "Echocardiogram",
      result:
        "Ejection fraction: 45%. Mild systolic dysfunction. No significant change from previous study.",
    },
    {
      title: "INR Test",
      result:
        "INR: 2.3 (target 2.0-3.0). Anticoagulation therapeutic. Continue current warfarin dose.",
    },
  ],
];

const usersData = [
  { username: "johnsmith", password: "password123" },
  { username: "sarahjohnson", password: "password123" },
  { username: "michaeldavis", password: "password123" },
  { username: "emilywilson", password: "password123" },
];

async function isDatabaseEmpty(): Promise<boolean> {
  try {
    const [userCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);
    const [patientCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(patients);

    // If both users and patients tables are empty, database is considered empty
    return userCount.count === 0 && patientCount.count === 0;
  } catch (error) {
    console.error("Error checking if database is empty:", error);
    throw error;
  }
}

async function clearDatabase() {
  console.log("🗑️  Clearing existing database data...");

  const isEmpty = await isDatabaseEmpty();

  if (isEmpty) {
    console.log(" ❌ Database is empty!");
    console.log(" ⚠️ Run: npm run db:migrate ");
    return;
  }

  try {
    console.log("🗑️  Deleting all records...");
    await db.delete(diagnosticTestResults);
    await db.delete(medications);
    await db.delete(medicalHistory);
    await db.delete(users);
    await db.delete(patients);

    console.log("🔄 Resetting ID sequences...");
    await db.run(sql`DELETE FROM sqlite_sequence WHERE name='users'`);
    await db.run(sql`DELETE FROM sqlite_sequence WHERE name='patients'`);
    await db.run(sql`DELETE FROM sqlite_sequence WHERE name='medication'`);
    await db.run(sql`DELETE FROM sqlite_sequence WHERE name='medical_history'`);
    await db.run(
      sql`DELETE FROM sqlite_sequence WHERE name='diagnostic_test_result'`,
    );
    console.log("✅ Database reset complete! IDs will start from 1.");
  } catch (error) {
    console.error("❌ Error clearing database:", error);
    throw error;
  }
}

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...\n");

    console.log("👑 Creating admin user...");
    try {
      await authService.registerAdmin("admin", "adminpassword123");
      console.log("✅ Admin user created successfully\n");
    } catch (error) {
      console.log("ℹ️  Admin user may already exist, continuing...\n");
    }

    console.log("👥 Creating patients and users...");
    const createdPatients = [];

    for (let i = 0; i < patientsData.length; i++) {
      try {
        const result = await authService.registerUser(
          usersData[i].username,
          usersData[i].password,
          patientsData[i],
        );
        createdPatients.push(result.user.patientId);
        console.log(
          `✅ Created patient: ${patientsData[i].name} (Username: ${usersData[i].username})`,
        );
      } catch (error) {
        console.log(
          `⚠️  Patient ${patientsData[i].name} may already exist, skipping...`,
        );
      }
    }

    const allPatients = await db.query.patients.findMany();
    console.log(`\n📊 Found ${allPatients.length} patients in database\n`);

    console.log("💊 Creating medications...");
    for (let i = 0; i < allPatients.length && i < medicationsData.length; i++) {
      const patientId = allPatients[i].id;
      const patientMeds = medicationsData[i];

      for (const med of patientMeds) {
        try {
          await db.insert(medications).values({
            ...med,
            patientId,
          });
          console.log(
            `✅ Added medication ${med.name} for ${allPatients[i].name}`,
          );
        } catch (error) {
          console.log(
            `⚠️  Could not add medication ${med.name} for ${allPatients[i].name}`,
          );
        }
      }
    }

    console.log("\n📋 Creating medical history...");
    for (
      let i = 0;
      i < allPatients.length && i < medicalHistoryData.length;
      i++
    ) {
      const patientId = allPatients[i].id;
      const history = medicalHistoryData[i];

      try {
        await db.insert(medicalHistory).values({
          ...history,
          patientId,
        });
        console.log(`✅ Added medical history for ${allPatients[i].name}`);
      } catch (error) {
        console.log(
          `⚠️  Could not add medical history for ${allPatients[i].name}`,
        );
      }
    }

    console.log("\n🔬 Creating diagnostic test results...");
    for (
      let i = 0;
      i < allPatients.length && i < diagnosticTestResultsData.length;
      i++
    ) {
      const patientId = allPatients[i].id;
      const testResults = diagnosticTestResultsData[i];

      for (const test of testResults) {
        try {
          await db.insert(diagnosticTestResults).values({
            ...test,
            patientId,
          });
          console.log(
            `✅ Added test result "${test.title}" for ${allPatients[i].name}`,
          );
        } catch (error) {
          console.log(
            `⚠️  Could not add test result "${test.title}" for ${allPatients[i].name}`,
          );
        }
      }
    }

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📝 Summary:");
    console.log(`   • Patients: ${allPatients.length}`);

    const medicationCount = await db.query.medications.findMany();
    const historyCount = await db.query.medicalHistory.findMany();
    const testCount = await db.query.diagnosticTestResults.findMany();

    console.log(`   • Medications: ${medicationCount.length}`);
    console.log(`   • Medical histories: ${historyCount.length}`);
    console.log(`   • Test results: ${testCount.length}`);

    console.log("\n🔐 Sample login credentials:");
    console.log(`   • Admin user: admin / adminpassword123`);
    for (let i = 0; i < Math.min(3, usersData.length); i++) {
      console.log(`   • ${usersData[i].username} / ${usersData[i].password}`);
    }
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

export { seedDatabase, clearDatabase };
