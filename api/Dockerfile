FROM node:24-slim

# better-sqlite3 needs native build tools (glibc-based, compatible with better-sqlite3)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev --build-from-source

COPY . .

EXPOSE 3001

CMD ["node", "index.js"]
