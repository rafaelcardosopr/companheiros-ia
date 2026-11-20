import { redirect } from "next/navigation";
import { Shell } from "@/components/ui";
import { requireUser } from "@/lib/auth/guards";
import { IdadeForm } from "./form";

export const metadata = { title: "Confirmar idade" };
export const dynamic = "force-dynamic";

export default async function ConfirmarIdadePage() {
  const user = await requireUser();
  if (user.ageConfirmedAt && user.termsAcceptedAt) redirect("/inicio");
  return (
    <Shell>
      <h1 className="mb-2 text-2xl font-semibold">Antes de começar</h1>
      <p className="mb-6 text-muted">
        Este serviço é exclusivo para maiores de 18 anos. Antes do lançamento público, a idade
        também será verificada por documento.
      </p>
      <IdadeForm />
    </Shell>
  );
}
