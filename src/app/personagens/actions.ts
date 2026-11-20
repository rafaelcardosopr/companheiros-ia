"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { characters } from "@/db/schema";
import { requireAdult } from "@/lib/auth/guards";
import { validateCharacter } from "@/lib/characters/validation";

export type CharacterFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
};

export async function salvarPersonagem(
  id: string | null,
  _prev: CharacterFormState,
  form: FormData,
): Promise<CharacterFormState> {
  const user = await requireAdult();
  const values = Object.fromEntries(
    [...form.entries()].filter(([, v]) => typeof v === "string"),
  ) as Record<string, string>;

  const result = validateCharacter(values);
  if (!result.ok) return { error: result.error, fieldErrors: result.fieldErrors, values };

  const { data } = result;
  const bio = data.tagline;
  let savedId = id;
  if (id) {
    const [row] = await db
      .update(characters)
      .set({ ...data, bio, updatedAt: new Date() })
      .where(and(eq(characters.id, id), eq(characters.ownerId, user.id)))
      .returning({ id: characters.id });
    if (!row) return { error: "Personagem não encontrado.", values };
  } else {
    const [row] = await db
      .insert(characters)
      .values({ ...data, bio, ownerId: user.id })
      .returning({ id: characters.id });
    savedId = row.id;
  }
  revalidatePath("/inicio");
  redirect(`/personagens/${savedId}`);
}

export async function excluirPersonagem(id: string) {
  const user = await requireAdult();
  await db.delete(characters).where(and(eq(characters.id, id), eq(characters.ownerId, user.id)));
  revalidatePath("/inicio");
  redirect("/inicio");
}
