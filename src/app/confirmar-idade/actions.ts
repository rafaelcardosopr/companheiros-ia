"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { ageOn, isAdult } from "@/lib/auth/age";
import { requireUser } from "@/lib/auth/guards";
import { endSession } from "@/lib/auth/session";

export type IdadeState = { error?: string };

export async function confirmarIdade(_prev: IdadeState, form: FormData): Promise<IdadeState> {
  const user = await requireUser();
  const birthDate = String(form.get("birthDate") ?? "");
  const confirm18 = form.get("confirm18") === "on";
  const terms = form.get("terms") === "on";

  if (!Number.isFinite(ageOn(birthDate))) return { error: "Informe uma data de nascimento válida." };
  if (!confirm18 || !terms) return { error: "Marque as duas confirmações para continuar." };

  if (!isAdult(birthDate)) {
    // Menor de idade: a conta fica bloqueada, para não dar para tentar outra data.
    await db
      .update(users)
      .set({ birthDate, suspendedAt: new Date() })
      .where(eq(users.id, user.id));
    await endSession();
    redirect("/conta-suspensa?motivo=idade");
  }

  const now = new Date();
  await db
    .update(users)
    .set({ birthDate, ageConfirmedAt: now, termsAcceptedAt: now })
    .where(eq(users.id, user.id));
  redirect("/inicio");
}
