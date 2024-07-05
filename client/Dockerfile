FROM node:22-alpine3.19 as builder

WORKDIR /app
ENV NODE_ENV=production

COPY . .


RUN npm ci


RUN npm run build

FROM nginx:latest

COPY --from=builder /app/dist /usr/share/nginx/html