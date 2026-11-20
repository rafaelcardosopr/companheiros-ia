import { defineConfig } from "drizzle-kit";

try {
  process.loadEnvFile();
} catch {
  // sem .env: usa as variáveis do ambiente
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
