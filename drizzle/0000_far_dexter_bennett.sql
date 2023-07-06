CREATE TABLE IF NOT EXISTS "accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"email" varchar(256) PRIMARY KEY NOT NULL,
	"membership" "membership"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "my_shows" (
	"id" serial PRIMARY KEY NOT NULL,
	"back_drop_path" varchar(256),
	"profile_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "playing_with_neon" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"value" real
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"account_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "my_shows" ADD CONSTRAINT "my_shows_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profiles" ADD CONSTRAINT "profiles_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
