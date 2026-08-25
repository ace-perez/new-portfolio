# Serve pre-built static portfolio assets with nginx-certbot
FROM jonasal/nginx-certbot:latest

# Remove default content
RUN rm -rf /usr/share/nginx/html/*

# Copy pre-built static files into Nginx
COPY dist /usr/share/nginx/html

# Copy nginx site config into user_conf.d (nginx-certbot convention)
COPY nginx_site.conf /etc/nginx/user_conf.d/portfolio.conf
