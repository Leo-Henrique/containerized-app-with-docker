# Aplicação conteinerizada com Docker

Aplicação de exemplo para demonstrar a conteinerização com o Docker.

## Binário da aplicação

O binário da aplicação — um back-end em Node.js — utiliza uma [imagem oficial do Node.js pelo Docker](https://hub.docker.com/_/node) e conta com algumas abordagens para manter um binário otimizado (contendo atualmente **167MB**).

<img 
  src="https://github.com/user-attachments/assets/90b171b0-3e20-4ead-9851-b493e4c17deb"
  alt="Docker image"
/>

### Distro Alpine

O primeiro passo visando a construção de um binário otimizado foi escolher uma versão de imagem do Node.js enxuta e que não contém recursos que sequer são utilizados. As versões Alpine tem origem da distro Alpine do Linux e possuem exatamente esse propósito.

Eu escolhi a [20.18-alpine](https://hub.docker.com/layers/library/node/20.18-alpine/images/sha256-d504f23acdda979406cf3bdbff0dff7933e5c4ec183dda404ed24286c6125e60?context=explore) que contém apenas **45.42 MB**. Eu também abri mão das versões mais recentes para evitar qualquer possível vulnerabilidade.

### Multi-stage build

Além do meu back-end em Node.js com TypeScript precisar ser compilado para JavaScript, eu também tenho muitas dependências de desenvolvimento que não fazem diferença alguma em produção.

A estratégia de utilizar múltiplos estágios na construção da imagem no Dockerfile foi fundamental para que eu pudesse resolver esse problema e manter um binário leve.

```Dockerfile
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --ignore-scripts

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm build

FROM base
WORKDIR /usr/src/app
# Copia somente as dependências de produção para a imagem, instaladas no estágio 'prod-deps'
COPY --from=prod-deps /usr/src/app/node_modules ./node_modules
# Copia os arquivos da aplicação para a imagem, construídas no estágio 'build'
COPY --from=build /usr/src/app/dist ./dist
EXPOSE $API_PORT
CMD ["pnpm", "start"]
```

## Rode localmente

### Dependências globais

Você precisa ter uma principal dependência instalada:

- [Docker](https://www.docker.com/products/docker-desktop/) 24.0.6 (ou qualquer versão superior)

### Clone o projeto

```bash
# git
git clone https://github.com/Leo-Henrique/containerized-app-with-docker.git

# GitHub CLI
gh repo clone Leo-Henrique/containerized-app-with-docker
```

### Suba os containers do Docker

Dois serviços serão iniciados. Um container conterá um servidor Node.js que usa [node:20.18-alpine](https://hub.docker.com/layers/library/node/20.18-alpine/images/sha256-d504f23acdda979406cf3bdbff0dff7933e5c4ec183dda404ed24286c6125e60?context=explore) como imagem base e outro conterá um banco de dados Postgres que usa [postgres:16-alpine3.18](https://hub.docker.com/layers/library/postgres/16-alpine3.18/images/sha256-79790a9fa3ab75f5f590766d095fdd21cf292f1abbaa834bfe2036585ed0f2e5?context=explore) como imagem base.

```bash
docker compose up -d --build
```

### Verificar logs dos containers

```bash
docker compose logs
```

Se tudo estiver funcionando, você verá nas últimas linhas dos logs uma mensagem assim:

```bash
containerized-app-with-docker-api       | Application "containerized-app-with-docker" is running!
containerized-app-with-docker-api       | http://172.20.0.2:3333/docs
```

Como mostra a mensagem, você conseguirá acessar a documentação da API em: [http://172.20.0.2:3333/docs](http://172.20.0.2:3333/docs), um servidor em Node.js, sem o próprio Node.js instalado na sua máquina propriamente dita, mas sim, no container (um processo totalmente isolado)!
