ALTER TABLE `diagnostic_test_result` RENAME TO `diagnostic_test_results`;--> statement-breakpoint
ALTER TABLE `medical_history` RENAME TO `medical_histories`;--> statement-breakpoint
ALTER TABLE `medication` RENAME TO `medications`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_diagnostic_test_results` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`result` text,
	`patient_id` integer NOT NULL,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_diagnostic_test_results`("id", "title", "result", "patient_id", "created_at", "updated_at") SELECT "id", "title", "result", "patient_id", "created_at", "updated_at" FROM `diagnostic_test_results`;--> statement-breakpoint
DROP TABLE `diagnostic_test_results`;--> statement-breakpoint
ALTER TABLE `__new_diagnostic_test_results` RENAME TO `diagnostic_test_results`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_medical_histories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`medical_conditions` text,
	`allergies` text,
	`surgeries` text,
	`treatments` text,
	`patient_id` integer NOT NULL,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_medical_histories`("id", "medical_conditions", "allergies", "surgeries", "treatments", "patient_id", "created_at", "updated_at") SELECT "id", "medical_conditions", "allergies", "surgeries", "treatments", "patient_id", "created_at", "updated_at" FROM `medical_histories`;--> statement-breakpoint
DROP TABLE `medical_histories`;--> statement-breakpoint
ALTER TABLE `__new_medical_histories` RENAME TO `medical_histories`;--> statement-breakpoint
CREATE TABLE `__new_medications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`dosage` text,
	`frequency` text,
	`duration` text,
	`patient_id` integer NOT NULL,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_medications`("id", "name", "dosage", "frequency", "duration", "patient_id", "created_at", "updated_at") SELECT "id", "name", "dosage", "frequency", "duration", "patient_id", "created_at", "updated_at" FROM `medications`;--> statement-breakpoint
DROP TABLE `medications`;--> statement-breakpoint
ALTER TABLE `__new_medications` RENAME TO `medications`;