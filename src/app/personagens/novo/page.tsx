import { Shell } from "@/components/ui";
import { requireAdult } from "@/lib/auth/guards";
import { CharacterForm } from "../character-form";

export const metadata = { title: "Criar personagem" };
export const dynamic = "force-dynamic";

export default async function NovoPersonagemPage() {
  await requireAdult();
  return (
    <Shell>
      <h1 className="mb-2 text-2xl font-semibold">Criar personagem</h1>
      <p className="mb-6 text-sm text-muted">
        Personagens precisam ser adultos (18 anos ou mais) e não podem ser baseados em pessoas reais.
      </p>
      <CharacterForm id={null} initial={{}} />
    </Shell>
  );
}
