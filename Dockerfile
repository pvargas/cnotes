FROM node:18-alpine AS cnotes
WORKDIR /app
COPY . .

RUN mv ./.env.prod ./.env
RUN npm ci
RUN npm run build

RUN rm -rf src/ static/ emailTemplates/ docker-compose.yml

USER node:node

CMD ["node","build/index.js"]