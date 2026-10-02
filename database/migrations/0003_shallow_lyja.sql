CREATE TABLE `bookingErrors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`doctorId` varchar(80),
	`attemptedAt` timestamp,
	`errorMessage` text NOT NULL,
	`errorCode` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bookingErrors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `patientAppointments` ADD `activeSlotKey` varchar(160);--> statement-breakpoint
ALTER TABLE `patientAppointments` ADD CONSTRAINT `patientAppointments_active_slot_unique` UNIQUE(`activeSlotKey`);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `bookingErrors` ADD CONSTRAINT `bookingErrors_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `patientAppointments_doc_sched_idx` ON `patientAppointments` (`doctorId`,`scheduledAt`,`status`);