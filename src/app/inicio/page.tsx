import { Shell } from "@/components/ui";
import { sair } from "@/lib/auth/actions";
import { requireAdult } from "@/lib/auth/guards";

export const metadata = { title: "Início" };
export const dynamic = "force-dynamic";

export default async function InicioPage() {
  const user = await requireAdult();
  return (
    <Shell>
      <h1 className="mb-2 text-2xl font-semibold">Olá{user.displayName ? `, ${user.displayName}` : ""}!</h1>
      <p className="text-muted">Você entrou como {user.email}.</p>
      <div className="mt-8 rounded-lg border border-border bg-card p-4 text-sm text-muted">
        O catálogo de personagens e o criador chegam na próxima etapa.
      </div>
      <form action={sair} className="mt-8">
        <button type="submit" className="text-sm text-muted underline">
          Sair
        </button>
      </form>
    </Shell>
  );
}
