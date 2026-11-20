import { Shell } from "@/components/ui";
import { EntrarForm } from "./form";

export const metadata = { title: "Entrar" };

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  return (
    <Shell>
      <h1 className="mb-2 text-2xl font-semibold">Entrar</h1>
      <p className="mb-6 text-muted">Sem senha: mandamos um link para o seu e-mail.</p>
      {erro === "link" && (
        <p className="mb-4 text-sm text-red-400">
          Esse link expirou ou já foi usado. Peça um novo.
        </p>
      )}
      <EntrarForm />
    </Shell>
  );
}
