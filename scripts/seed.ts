// Cria ou atualiza o elenco inicial do catálogo. Rodar com: npm run db:seed
try {
  process.loadEnvFile();
} catch {
  // sem .env: usa as variáveis do ambiente
}

async function main() {
  const { db } = await import("../src/db");
  const { characters } = await import("../src/db/schema");
  const { CAST } = await import("../src/db/seed-data");
  const { contentViolation } = await import("../src/lib/characters/validation");

  for (const c of CAST) {
    const violation = contentViolation(c);
    if (violation) throw new Error(`${c.name}: ${violation}`);
    await db
      .insert(characters)
      .values({ ...c, ownerId: null })
      .onConflictDoUpdate({ target: characters.slug, set: { ...c, updatedAt: new Date() } });
    console.log(`ok: ${c.name}`);
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
