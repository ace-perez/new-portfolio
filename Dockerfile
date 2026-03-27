# Stage 1: Build the Vite app
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Remove default Nginx page
RUN rm -rf /usr/share/nginx/html/*
# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom Nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
