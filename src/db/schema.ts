import {
  pgTable,
  pgEnum,
  pgSchema,
  AnyPgColumn,
  serial,
  text,
  real,
  varchar,
} from "drizzle-orm/pg-core"

import { sql } from "drizzle-orm"

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name"),
  phone: varchar("phone", { length: 256 }),
})

export const playingWithNeon = pgTable("playing_with_neon", {
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull(),
  value: real("value"),
})
