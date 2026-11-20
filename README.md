# Companheiros IA

Plataforma de companheiros de IA para maiores de 18 anos (nome provisório). Plano completo:
[MVP de companheiros de IA: arquitetura e escopo](https://claude.ai/artifact/SvdsEzffVKqHi99jQX1dLp).

## O que já funciona (etapa 1)

- Página inicial com aviso de conteúdo adulto
- Login sem senha, por link mágico no e-mail
- Confirmação de idade (data de nascimento + aceite dos termos). Quem informa menos de 18 anos tem a conta bloqueada
- Termos e regras de conteúdo
- Banco PostgreSQL com pgvector e todas as tabelas do MVP (usuários, personagens, conversas, mensagens, memória, personas, denúncias)
- App instalável no celular (PWA)

## Etapa 2

- Catálogo com busca e filtro por tags, separando o elenco oficial dos personagens do usuário
- Elenco inicial de 6 personagens originais e adultos (`src/db/seed-data.ts`)
- Criador e edição de personagem: nome, idade, aparência, personalidade (12 arquétipos), relação, profissão, hobbies, história, jeito de falar, primeira mensagem e tags
- Validação: idade mínima de 18 anos e bloqueio de referências a menores e de nomes de pessoas reais (`src/lib/characters/blocklist.ts`)

## Rodar no Windows, tudo no disco F:

Precisa de: [Node.js 22 ou 24](https://nodejs.org), [Git](https://git-scm.com) e
[Docker Desktop](https://www.docker.com/products/docker-desktop/).

1. **Docker no F:** no Docker Desktop, abra Settings > Resources > Advanced > Disk image location
   e escolha uma pasta no F: (ex.: `F:\Docker`). Assim o banco não ocupa o C:.
2. **Baixar o projeto** (no PowerShell):
   ```powershell
   cd F:\
   git clone https://github.com/rafaelcardosopr/companheiros-ia.git
   cd F:\companheiros-ia
   ```
3. **Configurar:**
   ```powershell
   copy .env.example .env
   npm install
   ```
4. **Subir o banco e criar as tabelas:**
   ```powershell
   npm run db:up
   npm run db:migrate
   npm run db:seed
   ```
5. **Rodar o app:**
   ```powershell
   npm run dev
   ```
   Abra http://localhost:3000. Sem e-mail configurado, o link de login aparece na própria tela e no
   terminal.

Para parar o banco: `docker compose stop`. Os dados ficam guardados para a próxima vez.

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | App em modo desenvolvimento |
| `npm run build` / `npm start` | Versão de produção |
| `npm test` | Testes automáticos |
| `npm run lint` | Verificação de código |
| `npm run db:up` | Sobe o Postgres no Docker |
| `npm run db:generate` | Gera migração depois de mudar `src/db/schema.ts` |
| `npm run db:migrate` | Aplica as migrações |
| `npm run db:seed` | Cria ou atualiza o elenco inicial |

## Estrutura

- `src/app` – páginas (entrar, confirmar-idade, inicio, termos)
- `src/lib/auth` – login, sessão, confirmação de idade
- `src/db` – esquema do banco (Drizzle ORM)
- `drizzle/` – migrações SQL
