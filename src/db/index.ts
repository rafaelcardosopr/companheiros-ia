import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { sql?: ReturnType<typeof postgres> };

// A conexão só abre na primeira consulta. Reaproveitada entre recarregamentos do modo dev.
const sql = (globalForDb.sql ??= postgres(process.env.DATABASE_URL as string, { max: 10 }));

export const db = drizzle({ client: sql, schema });
