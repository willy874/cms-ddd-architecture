FROM node:22-alpine3.20
WORKDIR /app
COPY . .
RUN npm install -g pnpm@9.14.2
RUN pnpm install
