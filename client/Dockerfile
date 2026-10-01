# Stage 1: React App Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Nginx Web Server for Static Files
FROM nginx:alpine

# Vite output folder ('dist') ko Nginx HTML folder me copy karein
COPY --from=builder /app/dist /usr/share/nginx/html

# Port 80 expose karein
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]