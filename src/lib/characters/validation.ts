import { z } from "zod";
import { MINOR_TERMS, REAL_PEOPLE } from "./blocklist";
import { ARCHETYPES, MAX_CHARACTER_AGE, MIN_CHARACTER_AGE, RELATIONSHIPS } from "./options";

const text = (max: number) => z.string().trim().max(max).default("");

export const characterInput = z.object({
  name: z.string().trim().min(2, "Dê um nome com pelo menos 2 letras.").max(40),
  age: z.coerce
    .number({ invalid_type_error: "Informe a idade." })
    .int()
    .min(MIN_CHARACTER_AGE, `A idade mínima é ${MIN_CHARACTER_AGE} anos.`)
    .max(MAX_CHARACTER_AGE, `A idade máxima é ${MAX_CHARACTER_AGE} anos.`),
  archetype: z.enum(ARCHETYPES, { errorMap: () => ({ message: "Escolha uma personalidade." }) }),
  relationship: z.enum(RELATIONSHIPS, { errorMap: () => ({ message: "Escolha o tipo de relação." }) }),
  tagline: text(120),
  appearance: text(800),
  personality: text(800),
  backstory: text(2000),
  occupation: text(80),
  hobbies: text(200),
  speakingStyle: text(400),
  greeting: text(600),
  tags: z
    .string()
    .default("")
    .transform((s) =>
      [...new Set(s.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean))].slice(0, 8),
    ),
});

export type CharacterInput = z.infer<typeof characterInput>;

function normalize(s: string): string {
  return ` ${s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")} `;
}

const includesTerm = (haystack: string, term: string) =>
  haystack.includes(` ${normalize(term).trim()} `);

/**
 * Idades abaixo de 18 escritas no texto, como "tem 16 anos", "16 anos de idade",
 * "is 15" ou "15-year-old". Frases como "trabalha há 9 anos" não contam.
 */
const N = "(?:[0-9]|1[0-7])";
const UNDERAGE_PATTERNS = [
  // "tem 16 anos", "com apenas 17 anos" (mas não "com 5 anos de carreira")
  new RegExp(`\\b(?:tem|tenho|tinha|com|idade de)\\s+(?:apenas\\s+|s[oó]\\s+)?${N}\\s*anos\\b(?!\\s+de\\s+(?:carreira|experi[eê]ncia|profiss[aã]o|trabalho|casad|namoro|estrada))`, "i"),
  new RegExp(`\\b(?:aged?|is|i'?m|am)\\s+(?:only\\s+|just\\s+)?${N}\\b`, "i"),
  new RegExp(`\\b${N}\\s*anos de idade\\b`, "i"),
  new RegExp(`\\b${N}\\s*-?\\s*(?:years?|yrs?)\\s*-?\\s*old\\b`, "i"),
  new RegExp(`\\b${N}\\s*(?:yo|y\\/o)\\b`, "i"),
];
const mentionsUnderage = (s: string) => UNDERAGE_PATTERNS.some((r) => r.test(s));

/** Regras de conteúdo que valem para qualquer personagem. Devolve a mensagem de erro, ou null. */
export function contentViolation(input: Pick<CharacterInput, "name"> & Record<string, unknown>): string | null {
  const all = Object.values(input)
    .flat()
    .filter((v): v is string => typeof v === "string")
    .join(" \n ");
  const norm = normalize(all);

  if (MINOR_TERMS.some((t) => includesTerm(norm, t)) || mentionsUnderage(all)) {
    return "Personagens precisam ser claramente adultos. Remova qualquer referência a menores de idade.";
  }
  if (REAL_PEOPLE.some((p) => includesTerm(norm, p))) {
    return "Não é permitido criar personagens baseados em pessoas reais ou famosas.";
  }
  return null;
}

export type ValidationResult =
  | { ok: true; data: CharacterInput }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export function validateCharacter(raw: Record<string, unknown>): ValidationResult {
  const parsed = characterInput.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, error: "Revise os campos marcados.", fieldErrors };
  }
  const violation = contentViolation(parsed.data);
  if (violation) return { ok: false, error: violation };
  return { ok: true, data: parsed.data };
}
