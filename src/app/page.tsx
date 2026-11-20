import Link from "next/link";
import { redirect } from "next/navigation";
import { Shell, buttonClass } from "@/components/ui";
import { currentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function Home() {
  if (await currentUser()) redirect("/inicio");
  return (
    <Shell>
      <h1 className="text-3xl font-semibold leading-tight">
        Converse com personagens que lembram de você.
      </h1>
      <p className="mt-4 text-muted">
        Escolha um personagem ou crie o seu, do jeito que quiser. Conteúdo adulto, exclusivo para
        maiores de 18 anos.
      </p>
      <div className="mt-8 rounded-lg border border-border bg-card p-4 text-sm text-muted">
        Ao continuar, você confirma que tem 18 anos ou mais e que é legal acessar conteúdo adulto
        onde você está.
      </div>
      <Link href="/entrar" className={`${buttonClass} mt-6`}>
        Tenho 18 anos ou mais, entrar
      </Link>
    </Shell>
  );
}
