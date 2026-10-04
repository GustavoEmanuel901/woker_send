# Woker Send

Aplicação web para envio de currículos e extração de informações. O repositório é dividido em `frontend/` (React, TypeScript e Vite) e `backend/` (Node.js, Express, TypeScript e Prisma). O backend persiste usuários e arquivos no SQL Server.

## Requisitos

- Linux.
- Node.js 22 ou superior e npm.
- Docker Engine e Docker Compose.
- Portas `1433` (SQL Server), `3333` (API), `5173` (Vite) e, se usar o serviço S3 local, `9091` disponíveis.

Os comandos abaixo usam Bash e partem da raiz do repositório.

## Se você não tiver Docker

Docker só é necessário para iniciar os serviços locais definidos no Compose (SQL Server e, opcionalmente, o mock S3). Você ainda pode executar a aplicação sem Docker se tiver acesso a uma instância do SQL Server instalada diretamente no computador ou em outro servidor.

1. Instale e inicie o SQL Server para seu sistema operacional seguindo a documentação oficial da Microsoft, ou solicite os dados de acesso a uma instância já disponível. No Linux, confirme que a instância aceita conexões TCP na porta configurada e que o firewall permite o acesso.
2. Crie o banco `pay` nessa instância usando uma ferramenta SQL compatível, por exemplo `sqlcmd` ou SQL Server Management Studio:

   ```sql
   CREATE DATABASE [pay];
   ```

3. Configure `backend/.env` como na seção seguinte, preenchendo `DB_HOST` com `localhost` para uma instância local ou com o hostname/endereço da instância remota. Configure também a porta, o usuário, a senha e o nome do banco corretos. Para uma instância remota, confirme que ela está acessível pela rede.
4. Ignore os comandos `docker compose` e continue com a instalação das dependências e as migrações Prisma. Execute-os a partir de `backend/`:

   ```bash
   npm i
   npm run prisma:generate
   npm run db:migrate
   ```

O armazenamento local de arquivos já é o padrão, portanto o serviço S3 do Compose é opcional. Se optar por S3, será necessário configurar um serviço compatível e suas variáveis `S3_*` em `backend/.env`.

## Configurar SQL Server e banco de dados

1. Configure o ambiente do backend:

   ```bash
   cd backend
   cp .env.example .env
   ```

   Edite `backend/.env` e substitua `MSSQL_SA_PASSWORD` e `DB_PASSWORD` pela mesma senha forte, compatível com a política do SQL Server. Não compartilhe nem versione esse arquivo. Os valores locais sugeridos são `DB_HOST=localhost`, `DB_PORT=1433`, `DB_USER=sa` e `DB_NAME=pay`.

2. Inicie o SQL Server:

   ```bash
   docker compose up -d sqlserver
   docker compose ps
   ```

   Confirme que o serviço está saudável antes de continuar.

3. Crie o banco vazio `pay`. Substitua `SUA_SENHA` pela senha definida em `MSSQL_SA_PASSWORD`:

   ```bash
   docker compose exec -T sqlserver /opt/mssql-tools18/bin/sqlcmd \
     -S localhost -U sa -P 'SUA_SENHA' -C \
     -Q 'CREATE DATABASE [pay]'
   ```

   Se o banco já existir, não repita o comando de criação.

4. Instale as dependências, gere o cliente Prisma e aplique as migrações versionadas:

   ```bash
   npm i
   npm run prisma:generate
   npm run db:migrate
   ```

   As migrações criam e atualizam as tabelas. O comando `npm run db:migrate` usa as variáveis `DB_*` de `backend/.env`. Como alternativa, execute a migração pelo serviço Compose:

   ```bash
   docker compose --profile tools run --rm migrate
   ```

## Executar a aplicação

Mantenha dois terminais abertos.

Terminal 1 — API:

```bash
cd backend
npm i
npm run dev
```

A API inicia em `http://localhost:3333`. O comando `dev` gera o cliente Prisma antes de iniciar o servidor.

Terminal 2 — frontend:

```bash
cd frontend
npm i
npm run dev
```

Abra o endereço local mostrado pelo Vite (normalmente `http://localhost:5173`). O backend usa armazenamento local por padrão. Para testar o armazenamento S3 compatível local, inicie `docker compose up -d s3` a partir da pasta `backend` e configure `STORAGE_DRIVER=s3` e as variáveis `S3_*` em `backend/.env`. O serviço de exemplo do Compose fica disponível na porta `9091`.

### Guardar arquivos localmente

Não é necessário usar S3 para guardar os arquivos enviados: o armazenamento local já é o padrão. No `backend/.env`, mantenha:

```dotenv
STORAGE_DRIVER=local
```

Por padrão, os arquivos ficam na pasta `backend/uploads/` e são disponibilizados pela API em `http://localhost:3333/uploads/`. Se preferir outro diretório, defina `LOCAL_UPLOADS_DIR` em `backend/.env` (caminho relativo ao diretório `backend` ou caminho absoluto), por exemplo:

```dotenv
LOCAL_UPLOADS_DIR=./dados/uploads
```

**Atenção:** atualmente o endpoint de envio aceita somente arquivos PDF de até 5 MB; imagens são rejeitadas. Portanto, embora o armazenamento local dispense Docker e S3, guardar imagens exige primeiro alterar a validação de tipos de arquivo do backend.

## Configurar Gemini e Mailtrap

As configurações ficam em `backend/.env`. Adicione credenciais válidas apenas se for usar os recursos correspondentes; não coloque chaves ou senhas no código, no Git ou em mensagens compartilhadas.

### Gemini (extração de dados do currículo)

O extrator de currículos chama a API do Gemini. Para usar a extração, crie uma chave de API no Google AI Studio e configure:

```dotenv
GEMINI_API_KEY=SUA_CHAVE_DA_API
GEMINI_MODEL=gemini-2.0-flash
GEMINI_TIMEOUT_MS=15000
```

`GEMINI_API_KEY` é obrigatória quando a extração é chamada. `GEMINI_MODEL` é opcional e, se omitida, o backend usa `gemini-2.0-flash`. `GEMINI_TIMEOUT_MS` também é opcional; define o limite de espera em milissegundos e o padrão é `15000` (15 segundos). Reinicie o backend depois de alterar o `.env`.

### Mailtrap (envio de e-mail)

Para os fluxos que enviam e-mail, configure uma integração SMTP no Mailtrap e copie os dados SMTP fornecidos pela sua conta:

```dotenv
MAILTRAP_HOST=host_smtp_fornecido_pelo_mailtrap
MAILTRAP_PORT=2525
MAILTRAP_USER=usuario_smtp
MAILTRAP_PASS=senha_smtp
```

Substitua host, porta, usuário e senha pelos valores mostrados na configuração SMTP da sua conta Mailtrap; a porta `2525` acima é apenas um exemplo, não um valor fixo exigido pelo projeto. O backend lê exatamente `MAILTRAP_HOST`, `MAILTRAP_PORT`, `MAILTRAP_USER` e `MAILTRAP_PASS`. Reinicie o backend após alterar o `.env`.

## Testes e build

Testes unitários do backend:

```bash
cd backend
npm i
npm test -- --runInBand
```

Para cobertura:

```bash
npm run test:coverage -- --runInBand
```

Build de produção do frontend (inclui verificação do TypeScript):

```bash
cd frontend
npm i
npm run build
```

O frontend não declara um script de testes no `package.json`. O backend também não declara atualmente um script `build`; para desenvolvimento, use `npm run dev`.

## Documentação do desafio

Consulte [DESENVOLVIMENTO.md](./DESENVOLVIMENTO.md) para o registro do processo, decisões, uso de IA, validações e limitações.
