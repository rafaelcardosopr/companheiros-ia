import Link from "next/link";
import { APP_NAME } from "@/lib/brand";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 py-8">
      <Link href="/" className="mb-10 text-lg font-semibold tracking-tight">
        {APP_NAME}
      </Link>
      <main className="flex flex-1 flex-col">{children}</main>
      <footer className="mt-10 text-xs text-muted">
        Somente para maiores de 18 anos. Todos os personagens são fictícios e adultos.{" "}
        <Link href="/termos" className="underline">
          Termos e regras de conteúdo
        </Link>
      </footer>
    </div>
  );
}

export const inputClass =
  "w-full rounded-lg border border-border bg-card px-3 py-2.5 text-foreground outline-none focus:border-accent";

export const buttonClass =
  "inline-flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 font-medium text-white disabled:opacity-60";
