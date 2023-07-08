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
  id: varchar("id", { length: 256 }).primaryKey(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  email: varchar("email", { length: 256 }).notNull(),
  membership: memebershipEnum("membership"),
})
export const accountsRelations = relations(accounts, ({ many }) => ({
  profiles: many(profiles),
}))

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  accountId: varchar("account_id", { length: 256 }).references(
    () => accounts.id
  ),
  profileImgPath: varchar("profile_img_path", { length: 256 })
    .default("/adventurerNeutral-1.svg")
    .notNull(),
})
export const profilesRelation = relations(profiles, ({ one, many }) => ({
  ownerAccount: one(accounts, {
    fields: [profiles.accountId],
    references: [accounts.id],
  }),
  myShows: many(myShows),
}))

export const myShows = pgTable("my_shows", {
  id: integer("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  overview: text("overview").notNull(),
  voteAverage: real("vote_average").default(0),
  releaseDate: varchar("release_date", { length: 256 }),
  backdropPath: varchar("back_drop_path", { length: 256 }),
  profileId: integer("profile_id").references(() => profiles.id),
})
export const myShowsRelation = relations(myShows, ({ one }) => ({
  ownerProfile: one(profiles, {
    fields: [myShows.profileId],
    references: [profiles.id],
  }),
}))
