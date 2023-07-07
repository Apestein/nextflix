import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import postgres from "postgres"
import "dotenv/config"

const sql = postgres(process.env.DATABASE_URL ?? "", { max: 1 })
const db: PostgresJsDatabase = drizzle(sql)

async function main() {
  await migrate(db, { migrationsFolder: "drizzle" })
  console.log("migration completed")
}

void main()
