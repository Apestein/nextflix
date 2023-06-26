import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { env } from "~/env.mjs"

const sql = postgres(env.DATABASE_URL)
export const db: PostgresJsDatabase = drizzle(sql)
