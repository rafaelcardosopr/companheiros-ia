import { Shell } from "@/components/ui";
import { APP_NAME } from "@/lib/brand";

export const metadata = { title: "Termos e regras de conteúdo" };

const proibido = [
  "Qualquer conteúdo sexual ou sugestivo envolvendo menores de 18 anos, aparência ou linguagem infantilizada, ou cenários escolares com teor sexual.",
  "Personagens ou conteúdo sobre pessoas reais, celebridades, influenciadores ou pessoas que você conhece.",
  "Violência sexual, estupro, tortura, mutilação ou gore.",
  "Falta de consentimento: coerção, pessoa dopada ou inconsciente, incesto.",
  "Bestialidade e necrofilia.",
  "Incentivo ou instruções de automutilação e suicídio.",
  "Discurso de ódio, terrorismo, tráfico de pessoas ou instruções para crimes.",
];

export default function TermosPage() {
  return (
    <Shell>
      <h1 className="mb-4 text-2xl font-semibold">Termos e regras de conteúdo</h1>
      <p className="mb-3 text-sm text-muted">
        Versão provisória para testes. O texto final precisa de revisão jurídica antes do
        lançamento.
      </p>
      <div className="space-y-4 text-sm leading-relaxed">
        <p>
          O {APP_NAME} é um serviço de entretenimento com personagens fictícios gerados por
          inteligência artificial, exclusivo para maiores de 18 anos. Todos os personagens são
          adultos e nenhum representa uma pessoa real.
        </p>
        <h2 className="pt-2 font-semibold">É proibido, sem exceção</h2>
        <ul className="list-disc space-y-2 pl-5">
          {proibido.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>
          Mensagens e personagens que violem estas regras são bloqueados automaticamente e podem
          levar à suspensão da conta. Toda mensagem tem um botão de denúncia.
        </p>
        <h2 className="pt-2 font-semibold">Seus dados</h2>
        <p>
          Suas conversas são privadas. Você pode exportar ou excluir sua conta e todas as conversas
          a qualquer momento, conforme a LGPD.
        </p>
      </div>
    </Shell>
  );
}
