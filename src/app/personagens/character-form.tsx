"use client";

import { useActionState } from "react";
import { buttonClass, inputClass } from "@/components/ui";
import { ARCHETYPES, MAX_CHARACTER_AGE, MIN_CHARACTER_AGE, RELATIONSHIPS } from "@/lib/characters/options";
import { salvarPersonagem, type CharacterFormState } from "./actions";

type Initial = Partial<Record<string, string>>;

function Field({
  label,
  name,
  hint,
  error,
  children,
}: {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={name} className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {hint && <span className="block text-xs text-muted">{hint}</span>}
      {children}
      {error && <span className="block text-xs text-red-400">{error}</span>}
    </label>
  );
}

export function CharacterForm({ id, initial }: { id: string | null; initial: Initial }) {
  const [state, action, pending] = useActionState<CharacterFormState, FormData>(
    salvarPersonagem.bind(null, id),
    {},
  );
  const v = (k: string) => state.values?.[k] ?? initial[k] ?? "";
  const err = (k: string) => state.fieldErrors?.[k];
  const area = `${inputClass} min-h-24`;

  return (
    <form action={action} className="space-y-5" key={JSON.stringify(state.values ?? {})}>
      <div className="grid grid-cols-[1fr_6rem] gap-3">
        <Field label="Nome" name="name" error={err("name")}>
          <input id="name" name="name" required maxLength={40} defaultValue={v("name")} className={inputClass} />
        </Field>
        <Field label="Idade" name="age" error={err("age")}>
          <input
            id="age"
            name="age"
            type="number"
            required
            min={MIN_CHARACTER_AGE}
            max={MAX_CHARACTER_AGE}
            defaultValue={v("age")}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Frase de apresentação" name="tagline" hint="Aparece no catálogo." error={err("tagline")}>
        <input id="tagline" name="tagline" maxLength={120} defaultValue={v("tagline")} className={inputClass} />
      </Field>

      <Field
        label="Aparência"
        name="appearance"
        hint="Descreva um adulto: corpo, rosto, cabelo, estilo. Será usada nas imagens depois."
        error={err("appearance")}
      >
        <textarea id="appearance" name="appearance" maxLength={800} defaultValue={v("appearance")} className={area} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Personalidade" name="archetype" error={err("archetype")}>
          <select id="archetype" name="archetype" required defaultValue={v("archetype")} className={inputClass}>
            <option value="" disabled>
              Escolha
            </option>
            {ARCHETYPES.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </Field>
        <Field label="Relação com você" name="relationship" error={err("relationship")}>
          <select id="relationship" name="relationship" required defaultValue={v("relationship")} className={inputClass}>
            <option value="" disabled>
              Escolha
            </option>
            {RELATIONSHIPS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Detalhes da personalidade" name="personality" error={err("personality")}>
        <textarea id="personality" name="personality" maxLength={800} defaultValue={v("personality")} className={area} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Profissão" name="occupation" error={err("occupation")}>
          <input id="occupation" name="occupation" maxLength={80} defaultValue={v("occupation")} className={inputClass} />
        </Field>
        <Field label="Hobbies" name="hobbies" error={err("hobbies")}>
          <input id="hobbies" name="hobbies" maxLength={200} defaultValue={v("hobbies")} className={inputClass} />
        </Field>
      </div>

      <Field label="História" name="backstory" error={err("backstory")}>
        <textarea id="backstory" name="backstory" maxLength={2000} defaultValue={v("backstory")} className={area} />
      </Field>

      <Field label="Jeito de falar" name="speakingStyle" error={err("speakingStyle")}>
        <input id="speakingStyle" name="speakingStyle" maxLength={400} defaultValue={v("speakingStyle")} className={inputClass} />
      </Field>

      <Field label="Primeira mensagem" name="greeting" hint="Como o personagem começa a conversa." error={err("greeting")}>
        <textarea id="greeting" name="greeting" maxLength={600} defaultValue={v("greeting")} className={area} />
      </Field>

      <Field label="Tags" name="tags" hint="Separadas por vírgula, até 8." error={err("tags")}>
        <input id="tags" name="tags" defaultValue={v("tags")} className={inputClass} />
      </Field>

      {state.error && (
        <p className="rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">{state.error}</p>
      )}
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? "Salvando..." : id ? "Salvar alterações" : "Criar personagem"}
      </button>
    </form>
  );
}
