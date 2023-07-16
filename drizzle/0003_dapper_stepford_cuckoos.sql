DROP TABLE "playing_with_neon";--> statement-breakpoint
ALTER TABLE "my_shows" ALTER COLUMN "back_drop_path" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "my_shows" ALTER COLUMN "profile_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "my_shows" DROP COLUMN IF EXISTS "title";--> statement-breakpoint
ALTER TABLE "my_shows" DROP COLUMN IF EXISTS "overview";--> statement-breakpoint
ALTER TABLE "my_shows" DROP COLUMN IF EXISTS "vote_average";--> statement-breakpoint
ALTER TABLE "my_shows" DROP COLUMN IF EXISTS "release_date";