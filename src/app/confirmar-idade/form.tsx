"use client";

import Link from "next/link";
import { useActionState } from "react";
import { buttonClass, inputClass } from "@/components/ui";
import { confirmarIdade, type IdadeState } from "./actions";

export function IdadeForm() {
  const [state, action, pending] = useActionState<IdadeState, FormData>(confirmarIdade, {});
  return (
    <form action={action} className="space-y-5">
      <label className="block space-y-2">
        <span className="text-sm text-muted">Data de nascimento</span>
        <input name="birthDate" type="date" required className={inputClass} />
      </label>
      <label className="flex items-start gap-3 text-sm">
        <input name="confirm18" type="checkbox" className="mt-1" />
        <span>Tenho 18 anos ou mais e quero acessar conteúdo adulto.</span>
      </label>
      <label className="flex items-start gap-3 text-sm">
        <input name="terms" type="checkbox" className="mt-1" />
        <span>
          Li e aceito os{" "}
          <Link href="/termos" target="_blank" className="underline">
            termos e as regras de conteúdo
          </Link>
          .
        </span>
      </label>
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? "Salvando..." : "Continuar"}
      </button>
    </form>
  );
}
