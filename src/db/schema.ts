import { relations } from "drizzle-orm"
import {
  pgTable,
  varchar,
  integer,
  timestamp,
  pgEnum,
  primaryKey,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core"
import { planTuple } from "~/lib/configs"

export const membershipEnum = pgEnum("membership", planTuple)
export const accounts = pgTable(
  "accounts",
  {
    id: varchar("id", { length: 256 }).primaryKey(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    membership: membershipEnum("membership").notNull().default("free"),
    stripeCustomerId: varchar("stripe_customer_id", { length: 256 }),
    activeProfileId: varchar("active_profile_id", { length: 256 }).notNull(),
  },
  (table) => {
    return {
      activeProfileIdx: uniqueIndex("active_profile_idx").on(
        table.activeProfileId,
      ),
    }
  },
)
export const accountsRelations = relations(accounts, ({ many, one }) => ({
  profiles: many(profiles),
  activeProfile: one(profiles, {
    fields: [accounts.activeProfileId],
    references: [profiles.id],
  }),
}))

export const profiles = pgTable(
  "profiles",
  {
    id: varchar("id", { length: 256 }).primaryKey(),
    accountId: varchar("account_id", { length: 256 })
      .references(() => accounts.id, { onDelete: "cascade" })
      .notNull(),
    profileImgPath: varchar("profile_img_path", { length: 256 }).notNull(),
    name: varchar("name", { length: 256 }).notNull(),
  },
  (table) => {
    return {
      accountIdIdx: index("account_id_idx").on(table.accountId),
    }
  },
)
export const profilesRelation = relations(profiles, ({ one, many }) => ({
  ownerAccount: one(accounts, {
    fields: [profiles.accountId],
    references: [accounts.id],
  }),
  savedShows: many(myShows),
}))

export const mediaTypeEnum = pgEnum("media_type", ["movie", "tv"])
export const myShows = pgTable(
  "my_shows",
  {
    id: integer("id").notNull(),
    mediaType: mediaTypeEnum("media_type").notNull(),
    profileId: varchar("profile_id", { length: 256 })
      .references(() => profiles.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => {
    return {
      profileIdIdx: index("profile_id_idx").on(table.profileId),
      pk: primaryKey(table.id, table.profileId),
    }
  },
)
export const myShowsRelation = relations(myShows, ({ one }) => ({
  profile: one(profiles, {
    fields: [myShows.profileId],
    references: [profiles.id],
  }),
}))
