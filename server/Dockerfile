FROM node:22-alpine3.19

WORKDIR /usr/src/app

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install

COPY . .
RUN npm run build
EXPOSE 3001
CMD  ["npm", "run", "prod"]