PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_purchases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`supplier_name` text NOT NULL,
	`total_amount` real DEFAULT 0 NOT NULL,
	`purchased_at` text DEFAULT '2026-06-10T17:44:59.739Z' NOT NULL,
	`created_by` integer,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_purchases`("id", "supplier_name", "total_amount", "purchased_at", "created_by") SELECT "id", "supplier_name", "total_amount", "purchased_at", "created_by" FROM `purchases`;--> statement-breakpoint
DROP TABLE `purchases`;--> statement-breakpoint
ALTER TABLE `__new_purchases` RENAME TO `purchases`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_sales` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`customer_name` text,
	`total_amount` real DEFAULT 0 NOT NULL,
	`sold_at` text DEFAULT '2026-06-10T17:44:59.762Z' NOT NULL,
	`created_by` integer,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_sales`("id", "customer_name", "total_amount", "sold_at", "created_by") SELECT "id", "customer_name", "total_amount", "sold_at", "created_by" FROM `sales`;--> statement-breakpoint
DROP TABLE `sales`;--> statement-breakpoint
ALTER TABLE `__new_sales` RENAME TO `sales`;