ALTER TABLE "my_shows" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "my_shows" ADD COLUMN "title" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "my_shows" ADD COLUMN "overview" text NOT NULL;--> statement-breakpoint
ALTER TABLE "my_shows" ADD COLUMN "vote_average" real DEFAULT 0;--> statement-breakpoint
ALTER TABLE "my_shows" ADD COLUMN "release_date" varchar(256);