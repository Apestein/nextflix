import { relations } from "drizzle-orm"
import {
  pgTable,
  serial,
  text,
  real,
  varchar,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core"

export const playingWithNeon = pgTable("playing_with_neon", {
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull(),
  value: real("value"),
})

export const memebershipEnum = pgEnum("membership", [
  "basic",
  "standard",
  "premium",
])
export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("createdAt").defaultNow(),
  email: varchar("email", { length: 191 }).notNull(),
  membership: memebershipEnum("membership"),
})
export const accountsRelations = relations(accounts, ({ many }) => ({
  profiles: many(profiles),
}))

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  accountId: integer("account_id").references(() => accounts.id),
})
export const profilesRelation = relations(profiles, ({ one, many }) => ({
  ownerAccount: one(accounts, {
    fields: [profiles.accountId],
    references: [accounts.id],
  }),
  myShows: many(myShows),
}))

export const myShows = pgTable("my_shows", {
  id: serial("id").primaryKey(),
  backdropPath: varchar("back_drop_path", { length: 256 }),
  profileId: integer("profile_id").references(() => profiles.id),
})
export const myShowsRelation = relations(myShows, ({ one }) => ({
  ownerProfile: one(profiles, {
    fields: [myShows.profileId],
    references: [profiles.id],
  }),
}))
