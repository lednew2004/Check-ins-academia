# Use a imagem oficial do Node
FROM node:22.21.1-slim AS base

WORKDIR /app

# Instala o openssl que o Prisma exige
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Estágio de construção
FROM base AS build

# Instala dependências de compilação
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Copia arquivos de dependências
COPY package-lock.json package.json ./
RUN npm ci

# Copia a pasta prisma e gera o cliente customizado
COPY prisma ./prisma/
RUN npx prisma generate

# Copia o restante do código (src, tsconfig, etc)
COPY . .

# Faz o build (tsup)
RUN npm run build

# Estágio final (imagem mais leve para rodar)
FROM base

COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/generated /app/generated
COPY --from=build /app/package.json /app/package.json

EXPOSE 3333

CMD [ "npm", "run", "start" ]