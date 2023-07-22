DO $$ BEGIN
 CREATE TYPE "membership" AS ENUM('basic', 'standard', 'premium');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"email" varchar(256) NOT NULL,
	"membership" "membership",
	"active_profile_id" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "my_shows" (
	"id" integer PRIMARY KEY NOT NULL,
	"back_drop_path" varchar(256) NOT NULL,
	"title" varchar(256) NOT NULL,
	"overview" text NOT NULL,
	"vote_average" real NOT NULL,
	"release_data" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"account_id" varchar(256),
	"profile_img_path" varchar(256) DEFAULT '/adventurerNeutral-1.svg' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles_to_my_shows" (
	"profile_id" varchar(256),
	"my_show_id" integer,
	CONSTRAINT profiles_to_my_shows_my_show_id_profile_id PRIMARY KEY("my_show_id","profile_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profiles" ADD CONSTRAINT "profiles_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profiles_to_my_shows" ADD CONSTRAINT "profiles_to_my_shows_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profiles_to_my_shows" ADD CONSTRAINT "profiles_to_my_shows_my_show_id_my_shows_id_fk" FOREIGN KEY ("my_show_id") REFERENCES "my_shows"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
