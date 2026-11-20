import "server-only";
import { and, eq, gt, isNull } from "drizzle-orm";
import { cookies } from "next/headers";
import { cache } from "react";
import { db } from "@/db";
import { loginTokens, sessions, users, type User } from "@/db/schema";
import { hashToken, newToken } from "./tokens";

export const SESSION_COOKIE = "sessao";
const SESSION_DAYS = 30;
const LOGIN_TOKEN_MINUTES = 15;

export async function createLoginToken(email: string): Promise<string> {
  const token = newToken();
  await db.insert(loginTokens).values({
    tokenHash: hashToken(token),
    email,
    expiresAt: new Date(Date.now() + LOGIN_TOKEN_MINUTES * 60_000),
  });
  return token;
}

/** Consome o token do link mágico e devolve o usuário (criado se for o primeiro acesso). */
export async function consumeLoginToken(token: string): Promise<User | null> {
  const [row] = await db
    .update(loginTokens)
    .set({ usedAt: new Date() })
    .where(
      and(
        eq(loginTokens.tokenHash, hashToken(token)),
        isNull(loginTokens.usedAt),
        gt(loginTokens.expiresAt, new Date()),
      ),
    )
    .returning();
  if (!row) return null;

  const [user] = await db
    .insert(users)
    .values({ email: row.email })
    .onConflictDoUpdate({ target: users.email, set: { email: row.email } })
    .returning();
  return user;
}

export async function startSession(userId: string): Promise<void> {
  const token = newToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  await db.insert(sessions).values({ idHash: hashToken(token), userId, expiresAt });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await db.delete(sessions).where(eq(sessions.idHash, hashToken(token)));
  jar.delete(SESSION_COOKIE);
}

export const currentUser = cache(async (): Promise<User | null> => {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const [row] = await db
    .select({ user: users })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.idHash, hashToken(token)), gt(sessions.expiresAt, new Date())))
    .limit(1);
  return row?.user ?? null;
});
