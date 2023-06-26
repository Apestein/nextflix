/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import postgres from "postgres"
import "dotenv/config"

const sql = postgres(process.env.DATABASE_URL ?? "")
const db: PostgresJsDatabase = drizzle(sql)

const main = async () => {
  await migrate(db, { migrationsFolder: "drizzle" })
  console.log("migration complete")
}

void main()
