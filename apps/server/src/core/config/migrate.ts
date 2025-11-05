import { Pool } from "pg";
import { migrate } from "drizzle-orm/node-postgres/migrator"; // migrate est une fonction de drizzle qui permet de migrer la db
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";

import { env } from "./env";
const { DATABASE_URL } = env;

async function main() {
  // on crée un pool de connexion avec notre databse url (credentials)
  const pool = new Pool({ connectionString: DATABASE_URL });

  // On initialise cette connexion pour avoir une instance de NodePgDatabase (et profiter de drizzle avec)
  const db: NodePgDatabase = drizzle(pool);

  console.log("Migrating database...");

  // on appelle la fonction migrate de drizzle pour appliquer la migration
  await migrate(db, { migrationsFolder: "src/core/database/migrations" });

  console.log("Database migrated successfully !");

  // On ferme la connexion à la db
  await pool.end();
}

main();