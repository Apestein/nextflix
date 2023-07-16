import { relations, type InferModel } from "drizzle-orm"
import {
  pgTable,
  serial,
  text,
  real,
  varchar,
  integer,
  timestamp,
  pgEnum,
  json,
} from "drizzle-orm/pg-core"

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
  backdropPath: varchar("back_drop_path", { length: 256 }).notNull(),
  profileId: integer("profile_id")
    .references(() => profiles.id)
    .notNull(),
  // title: varchar("title", { length: 256 }),
  // overview: text("overview"),
  // voteAverage: real("vote_average"),
  // releaseDate: varchar("release_date", { length: 256 }),
  // videos: json("videos")
  //   .$type<{ results: { key: string; type: string }[] }>()
  //   .default({ results: [] })
  //   .notNull(),
  // genres: json("genres")
  //   .$type<{ id: number; name: string }[]>()
  //   .default([])
  //   .notNull(),
})
export const myShowsRelation = relations(myShows, ({ one }) => ({
  ownerProfile: one(profiles, {
    fields: [myShows.profileId],
    references: [profiles.id],
  }),
}))

export type myShow = InferModel<typeof myShows>
