FROM node:22-alpine3.20
WORKDIR /app
COPY . .
RUN pnpm install
