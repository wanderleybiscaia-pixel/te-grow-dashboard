# Use official Node.js runtime as base image
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY src/ ./src/
COPY index.html .
COPY vite.config.js .
COPY tailwind.config.js .
COPY postcss.config.js .

RUN npm run build

# Nginx stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
