FROM node:20-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm config set strict-ssl false
RUN npm ci

COPY . .

ARG VITE_BASE_PATH=/haii/
ARG VITE_API_BASE_URL=/haii/api
ENV VITE_BASE_PATH=${VITE_BASE_PATH}
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

FROM nginx:1.27-alpine

WORKDIR /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html/haii

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
