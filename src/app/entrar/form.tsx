"use client";

import { useActionState } from "react";
import { buttonClass, inputClass } from "@/components/ui";
import { pedirLink, type EntrarState } from "./actions";

export function EntrarForm() {
  const [state, action, pending] = useActionState<EntrarState, FormData>(pedirLink, { ok: false });

  if (state.ok) {
    return (
      <div className="space-y-4">
        <p>Enviamos um link de acesso para o seu e-mail. Ele vale por 15 minutos.</p>
        {state.devLink && (
          <div className="rounded-lg border border-border bg-card p-3 text-sm">
            <p className="mb-2 text-muted">Modo desenvolvimento, sem e-mail configurado:</p>
            <a href={state.devLink} className="break-all text-accent underline">
              Entrar agora
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm text-muted">E-mail</span>
        <input name="email" type="email" required autoComplete="email" className={inputClass} />
      </label>
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? "Enviando..." : "Receber link de acesso"}
      </button>
    </form>
  );
}
