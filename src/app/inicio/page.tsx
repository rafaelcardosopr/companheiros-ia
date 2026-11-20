import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { Shell, buttonClass, inputClass } from "@/components/ui";
import { sair } from "@/lib/auth/actions";
import { requireAdult } from "@/lib/auth/guards";
import { listCharacters, listTags, type Character } from "@/lib/characters/queries";

export const metadata = { title: "Personagens" };
export const dynamic = "force-dynamic";

function Card({ c }: { c: Character }) {
  return (
    <Link
      href={`/personagens/${c.id}`}
      className="flex gap-3 rounded-xl border border-border bg-card p-3 transition hover:border-accent"
    >
      <Avatar name={c.name} url={c.avatarUrl} />
      <div className="min-w-0">
        <p className="font-medium">
          {c.name}, {c.age}
        </p>
        <p className="line-clamp-2 text-sm text-muted">{c.tagline || c.occupation}</p>
      </div>
    </Link>
  );
}

export default async function InicioPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string }>;
}) {
  const user = await requireAdult();
  const { q, tag } = await searchParams;
  const [list, tags] = await Promise.all([
    listCharacters(user.id, { q: q?.trim() || undefined, tag }),
    listTags(user.id),
  ]);
  const mine = list.filter((c) => c.ownerId === user.id);
  const cast = list.filter((c) => c.ownerId === null);

  return (
    <Shell>
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Personagens</h1>
        <Link href="/personagens/novo" className={`${buttonClass} w-auto text-sm`}>
          Criar personagem
        </Link>
      </div>

      <form className="mb-3">
        {tag && <input type="hidden" name="tag" value={tag} />}
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por nome ou profissão"
          className={inputClass}
        />
      </form>

      <div className="mb-6 flex flex-wrap gap-2 text-sm">
        <Link
          href={q ? `/inicio?q=${encodeURIComponent(q)}` : "/inicio"}
          className={`rounded-full border px-3 py-1 ${!tag ? "border-accent text-accent" : "border-border text-muted"}`}
        >
          Todos
        </Link>
        {tags.map((t) => (
          <Link
            key={t}
            href={`/inicio?tag=${encodeURIComponent(t)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className={`rounded-full border px-3 py-1 ${tag === t ? "border-accent text-accent" : "border-border text-muted"}`}
          >
            {t}
          </Link>
        ))}
      </div>

      {mine.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted">Meus personagens</h2>
          <div className="space-y-3">
            {mine.map((c) => (
              <Card key={c.id} c={c} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted">Elenco</h2>
        {cast.length === 0 ? (
          <p className="text-sm text-muted">Nenhum personagem encontrado.</p>
        ) : (
          <div className="space-y-3">
            {cast.map((c) => (
              <Card key={c.id} c={c} />
            ))}
          </div>
        )}
      </section>

      <form action={sair} className="mt-10">
        <button type="submit" className="text-sm text-muted underline">
          Sair ({user.email})
        </button>
      </form>
    </Shell>
  );
}
