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
  json,
  primaryKey,
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
  activeProfileId: varchar("active_profile_id", { length: 256 }).notNull(),
})
export const accountsRelations = relations(accounts, ({ many, one }) => ({
  profiles: many(profiles),
  activeProfile: one(profiles, {
    fields: [accounts.activeProfileId],
    references: [profiles.id],
  }),
}))

export const profiles = pgTable("profiles", {
  id: varchar("id", { length: 256 }).primaryKey(),
  accountId: varchar("account_id", { length: 256 }).references(
    () => accounts.id,
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
  profilesToMyShows: many(profilesToMyShows),
}))

export const myShows = pgTable("my_shows", {
  id: integer("id").primaryKey(),
  backdrop_path: varchar("back_drop_path", { length: 256 }).notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  overview: text("overview").notNull(),
  vote_average: real("vote_average").notNull(),
  release_date: varchar("release_data", { length: 256 }).notNull(),
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
export const myShowsRelation = relations(myShows, ({ many }) => ({
  profilesToMyShows: many(profilesToMyShows),
}))

export const profilesToMyShows = pgTable(
  "profiles_to_my_shows",
  {
    profileId: varchar("profile_id", { length: 256 }).notNull(),
    myShowId: integer("my_show_id").notNull(),
  },
  (t) => ({ pk: primaryKey(t.myShowId, t.profileId) }),
)
export const profilesToMyShowsRelations = relations(
  profilesToMyShows,
  ({ one }) => ({
    profile: one(profiles, {
      fields: [profilesToMyShows.profileId],
      references: [profiles.id],
    }),
    myShow: one(myShows, {
      fields: [profilesToMyShows.myShowId],
      references: [myShows.id],
    }),
  }),
)
