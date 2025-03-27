CREATE TABLE `diagnostic_test_result` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`result` text,
	`next_appointment` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer,
	`patient_id` integer NOT NULL,
	FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `medical_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`medical_conditions` text,
	`allergies` text,
	`surgeries` text,
	`treatments` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`patient_id` integer NOT NULL,
	FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `medication` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`dosage` text,
	`frequency` text,
	`duration` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`patient_id` integer NOT NULL,
	FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `patients` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`age` integer NOT NULL,
	`address` text NOT NULL,
	`phone_numnber` integer NOT NULL
);
