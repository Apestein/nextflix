import { migrate } from "drizzle-orm/postgres-js/migrator"
import * as schema from "./schema"
import { neon, neonConfig } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import "dotenv/config"

neonConfig.fetchConnectionCache = true

const sql = neon(process.env.DATABASE_URL ?? "")
const db = drizzle(sql, { schema })

async function main() {
  await migrate(db, { migrationsFolder: "drizzle" })
  console.log("migration completed")
}

void main()

// import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js"
// import { migrate } from "drizzle-orm/postgres-js/migrator"
// import postgres from "postgres"
// import "dotenv/config"

// const sql = postgres(process.env.DATABASE_URL ?? "", { max: 1 })
// const db: PostgresJsDatabase = drizzle(sql)

// async function main() {
//   await migrate(db, { migrationsFolder: "drizzle" })
//   console.log("migration completed")
// }

// void main()
