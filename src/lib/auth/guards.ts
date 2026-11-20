import "server-only";
import { redirect } from "next/navigation";
import type { User } from "@/db/schema";
import { currentUser } from "./session";

/** Exige login. */
export async function requireUser(): Promise<User> {
  const user = await currentUser();
  if (!user) redirect("/entrar");
  if (user.suspendedAt) redirect("/conta-suspensa");
  return user;
}

/** Exige login + idade confirmada + termos aceitos. Use em toda página com conteúdo. */
export async function requireAdult(): Promise<User> {
  const user = await requireUser();
  if (!user.ageConfirmedAt || !user.termsAcceptedAt) redirect("/confirmar-idade");
  return user;
}
