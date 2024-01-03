CREATE TABLE `account` (
	`userId` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`refresh_token` varchar(255),
	`access_token` varchar(255),
	`expires_at` int,
	`token_type` varchar(255),
	`scope` varchar(255),
	`id_token` text,
	`session_state` varchar(255),
	CONSTRAINT `account_provider_providerAccountId_pk` PRIMARY KEY(`provider`,`providerAccountId`)
);
--> statement-breakpoint
CREATE TABLE `attachments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`courseId` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`url` text NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `attachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `categoriesCourses` (
	`categoryId` varchar(255) NOT NULL,
	`courseId` varchar(255) NOT NULL,
	CONSTRAINT `categoriesCourses_categoryId_courseId_pk` PRIMARY KEY(`categoryId`,`courseId`)
);
--> statement-breakpoint
CREATE TABLE `chapters` (
	`id` varchar(255) NOT NULL,
	`courseId` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`videoUrl` text,
	`position` tinyint unsigned,
	`published` boolean NOT NULL DEFAULT false,
	`free` boolean NOT NULL DEFAULT false,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `chapters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` varchar(255) NOT NULL,
	`ownerId` varchar(255) NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`imageUrl` text,
	`price` decimal(19, 2),
	`published` boolean NOT NULL DEFAULT false,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mux` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`chapterId` varchar(255) NOT NULL,
	`assetId` varchar(255) NOT NULL,
	`playbackId` varchar(255),
	CONSTRAINT `mux_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`sessionToken` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `session_sessionToken` PRIMARY KEY(`sessionToken`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255),
	`email` varchar(255) NOT NULL,
	`emailVerified` datetime(3) DEFAULT CURRENT_TIMESTAMP,
	`role` enum('ADMIN','USER','TEACHER') NOT NULL DEFAULT 'USER',
	`stripeCustomerId` varchar(255),
	`image` varchar(255),
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_stripeCustomerId_unique` UNIQUE(`stripeCustomerId`)
);
--> statement-breakpoint
CREATE TABLE `usersChaptersProgresses` (
	`userId` varchar(255) NOT NULL,
	`chapterId` varchar(255) NOT NULL,
	`completed` boolean NOT NULL DEFAULT false,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `usersChaptersProgresses_userId_chapterId_pk` PRIMARY KEY(`userId`,`chapterId`)
);
--> statement-breakpoint
CREATE TABLE `usersCourses` (
	`userId` varchar(255) NOT NULL,
	`courseId` varchar(255) NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `usersCourses_userId_courseId_pk` PRIMARY KEY(`userId`,`courseId`)
);
--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`identifier` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `verificationToken_identifier_token_pk` PRIMARY KEY(`identifier`,`token`)
);
--> statement-breakpoint
CREATE INDEX `userId_idx` ON `account` (`userId`);--> statement-breakpoint
CREATE INDEX `published_idx` ON `courses` (`published`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `session` (`userId`);