-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
CREATE TABLE IF NOT EXISTS "playing_with_neon" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"value" real
);
