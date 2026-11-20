import "server-only";
import { and, desc, eq, ilike, isNull, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { characters } from "@/db/schema";

export type Character = typeof characters.$inferSelect;

/** Personagens que o usuário pode ver: o elenco oficial e os que ele criou. */
const visibleTo = (userId: string) => or(isNull(characters.ownerId), eq(characters.ownerId, userId));

export async function listCharacters(userId: string, opts: { q?: string; tag?: string } = {}) {
  const filters = [visibleTo(userId)];
  if (opts.q) {
    const like = `%${opts.q}%`;
    filters.push(or(ilike(characters.name, like), ilike(characters.tagline, like), ilike(characters.occupation, like)));
  }
  if (opts.tag) filters.push(sql`${opts.tag} = any(${characters.tags})`);
  return db
    .select()
    .from(characters)
    .where(and(...filters))
    .orderBy(desc(characters.ownerId), characters.name);
}

export async function listTags(userId: string): Promise<string[]> {
  const rows = await db
    .selectDistinct({ tag: sql<string>`unnest(${characters.tags})` })
    .from(characters)
    .where(visibleTo(userId));
  return rows.map((r) => r.tag).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export async function getCharacter(userId: string, id: string): Promise<Character | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const [row] = await db
    .select()
    .from(characters)
    .where(and(eq(characters.id, id), visibleTo(userId)))
    .limit(1);
  return row ?? null;
}
