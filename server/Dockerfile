FROM node:24-bookworm-slim
RUN npm install -g npm@12.2.3

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

COPY --chown=node:node src ./src

ENV NODE_ENV=production

USER node

EXPOSE 5000

CMD ["npm", "start"]
