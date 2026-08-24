# Stage 1: Build the Vite app
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with nginx-certbot (matches existing EC2 setup)
FROM jonasal/nginx-certbot:latest

# Remove default content
RUN rm -rf /usr/share/nginx/html/*

# Copy built static files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx site config into user_conf.d (nginx-certbot convention)
COPY nginx_site.conf /etc/nginx/user_conf.d/portfolio.conf
