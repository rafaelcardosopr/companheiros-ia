"use server";

import { z } from "zod";
import { sendLoginLink } from "@/lib/auth/email";
import { createLoginToken } from "@/lib/auth/session";

export type EntrarState = { ok: boolean; error?: string; devLink?: string };

const schema = z.object({ email: z.string().trim().toLowerCase().email() });

export async function pedirLink(_prev: EntrarState, form: FormData): Promise<EntrarState> {
  const parsed = schema.safeParse({ email: form.get("email") });
  if (!parsed.success) return { ok: false, error: "Digite um e-mail válido." };

  const token = await createLoginToken(parsed.data.email);
  const base = process.env.APP_URL ?? "http://localhost:3000";
  const url = `${base}/auth/verificar?token=${encodeURIComponent(token)}`;
  const sent = await sendLoginLink(parsed.data.email, url);

  const showLink = !sent && process.env.NODE_ENV !== "production";
  return { ok: true, devLink: showLink ? url : undefined };
}
