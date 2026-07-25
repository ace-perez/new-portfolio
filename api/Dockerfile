FROM node:22-alpine

# better-sqlite3 needs native build tools
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev --build-from-source

COPY . .

ENV NEW_RELIC_NO_CONFIG_FILE=true

EXPOSE 3001

CMD ["node", "index.js"]
