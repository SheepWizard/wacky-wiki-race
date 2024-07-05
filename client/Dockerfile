FROM node:22-alpine3.19 as builder

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY panda.config.ts package-lock.json

RUN npm ci

COPY . .
RUN npm run build

FROM nginx:latest

COPY --from=builder /app/dist /usr/share/nginx/html