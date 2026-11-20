import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/avatar";
import { Shell, buttonClass } from "@/components/ui";
import { requireAdult } from "@/lib/auth/guards";
import { getCharacter } from "@/lib/characters/queries";
import { excluirPersonagem } from "../actions";

export const dynamic = "force-dynamic";

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 whitespace-pre-line text-sm">{value}</dd>
    </div>
  );
}

export async function generateMetadata() {
  return { title: "Personagem" };
}

export default async function PersonagemPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdult();
  const { id } = await params;
  const c = await getCharacter(user.id, id);
  if (!c) notFound();
  const mine = c.ownerId === user.id;

  return (
    <Shell>
      <Link href="/inicio" className="mb-6 text-sm text-muted">
        ← Personagens
      </Link>
      <div className="mb-6 flex items-center gap-4">
        <Avatar name={c.name} url={c.avatarUrl} size="lg" />
        <div>
          <h1 className="text-2xl font-semibold">
            {c.name}, {c.age}
          </h1>
          <p className="text-sm text-muted">{c.occupation}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {c.tags.map((t) => (
              <span key={t} className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {c.tagline && <p className="mb-6">{c.tagline}</p>}

      <button type="button" disabled className={buttonClass} title="Disponível na etapa 3">
        Conversar (em breve)
      </button>

      <dl className="mt-8 space-y-5">
        <Row label="Personalidade" value={[c.archetype, c.personality].filter(Boolean).join(". ")} />
        <Row label="Relação" value={c.relationship} />
        <Row label="Aparência" value={c.appearance} />
        <Row label="História" value={c.backstory} />
        <Row label="Hobbies" value={c.hobbies} />
      </dl>

      {mine && (
        <div className="mt-10 flex items-center gap-4 text-sm">
          <Link href={`/personagens/${c.id}/editar`} className="underline">
            Editar
          </Link>
          <form action={excluirPersonagem.bind(null, c.id)}>
            <button type="submit" className="text-red-400 underline">
              Excluir
            </button>
          </form>
        </div>
      )}
    </Shell>
  );
}
