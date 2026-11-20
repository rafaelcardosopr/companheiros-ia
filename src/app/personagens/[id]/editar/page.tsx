import { notFound } from "next/navigation";
import { Shell } from "@/components/ui";
import { requireAdult } from "@/lib/auth/guards";
import { getCharacter } from "@/lib/characters/queries";
import { CharacterForm } from "../../character-form";

export const metadata = { title: "Editar personagem" };
export const dynamic = "force-dynamic";

export default async function EditarPersonagemPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdult();
  const { id } = await params;
  const c = await getCharacter(user.id, id);
  if (!c || c.ownerId !== user.id) notFound();
  const initial = {
    name: c.name,
    age: String(c.age),
    tagline: c.tagline,
    appearance: c.appearance,
    archetype: c.archetype,
    relationship: c.relationship,
    personality: c.personality,
    occupation: c.occupation,
    hobbies: c.hobbies,
    backstory: c.backstory,
    speakingStyle: c.speakingStyle,
    greeting: c.greeting,
    tags: c.tags.join(", "),
  };
  return (
    <Shell>
      <h1 className="mb-6 text-2xl font-semibold">Editar {c.name}</h1>
      <CharacterForm id={c.id} initial={initial} />
    </Shell>
  );
}
