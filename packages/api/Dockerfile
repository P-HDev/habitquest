# --- API ---
FROM node:20-alpine AS api-build
WORKDIR /app
COPY package.json package-lock.json* ./
COPY packages/api/package.json ./packages/api/
RUN npm ci --workspace=packages/api --legacy-peer-deps --ignore-scripts
COPY packages/api ./packages/api
RUN npm run build -w packages/api

FROM node:20-alpine AS api
WORKDIR /app
COPY --from=api-build /app/packages/api/dist ./dist
COPY --from=api-build /app/packages/api/package.json ./
COPY --from=api-build /app/node_modules ./node_modules
RUN mkdir -p data
EXPOSE 3000
CMD ["node", "dist/server.js"]
