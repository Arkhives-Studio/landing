# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app

COPY package.json tsconfig.json .npmrc* .yarnrc* pnpm-lock.yaml* package-lock.json* yarn.lock* ./

RUN \
  if [ -f package-lock.json ]; then npm install --production=false; \
  elif [ -f yarn.lock ]; then yarn install; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install; \
  else npm install --production=false; fi

COPY src ./src

RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

RUN \
  if [ -f package-lock.json ]; then npm install --omit=dev; \
  elif [ -f yarn.lock ]; then yarn install --production; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --prod; \
  else npm install --omit=dev; fi

COPY --from=base /app/dist ./dist

CMD ["node", "dist/index.js"]
