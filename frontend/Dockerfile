# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Production stage using Nginx
FROM nginx:alpine

# Copy built assets from build stage to Nginx directory
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx config templates + entrypoint for private-network proxying
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose the default Nginx port
EXPOSE 80

CMD ["/docker-entrypoint.sh"]
