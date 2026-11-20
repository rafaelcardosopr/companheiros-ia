import { Shell } from "@/components/ui";

export const metadata = { title: "Acesso indisponível" };

export default async function ContaSuspensaPage({
  searchParams,
}: {
  searchParams: Promise<{ motivo?: string }>;
}) {
  const { motivo } = await searchParams;
  return (
    <Shell>
      <h1 className="mb-2 text-2xl font-semibold">Acesso indisponível</h1>
      <p className="text-muted">
        {motivo === "idade"
          ? "Este serviço é exclusivo para maiores de 18 anos, por isso não é possível continuar."
          : "Esta conta foi suspensa por violar os termos de uso. Se acha que foi um engano, fale com o suporte."}
      </p>
    </Shell>
  );
}
