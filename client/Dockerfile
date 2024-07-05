FROM node:22-alpine3.19 AS builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY panda.config.ts .

RUN npm ci

COPY . .

ENV NODE_ENV=production
RUN npm run build

FROM nginx:latest

COPY --from=builder /app/dist /usr/share/nginx/html