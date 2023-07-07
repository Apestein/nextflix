ALTER TABLE "accounts" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "profile_img_path" varchar(256) DEFAULT '/adventurerNeutral-1.svg' NOT NULL;