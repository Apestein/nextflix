import { pgTable, pgEnum, pgSchema, AnyPgColumn, serial, text, real } from "drizzle-orm/pg-core"


import { sql } from "drizzle-orm"

export const playingWithNeon = pgTable("playing_with_neon", {
	id: serial("id").primaryKey().notNull(),
	name: text("name").notNull(),
	value: real("value"),
});