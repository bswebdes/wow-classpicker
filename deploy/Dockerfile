# Find Your Main auf dem eigenen Server (Dokploy, Benny 27.10.2026: weg von Netlify).
# Nuxt baut mit Nitro „node-server“: vorgerenderte Seiten + kleiner Server-Teil (Sitemap), Port 3000. Kontext = Repo-Wurzel.
FROM node:24-slim AS build
WORKDIR /app
RUN corepack enable
# Pakete zuerst und nur anhand des Lockfiles laden: Docker behält diese Schicht, solange sich
# package.json/Lockfile nicht ändern (spart ~40 s pro Deploy). Danach Code kopieren und offline installieren.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch
COPY . .
RUN pnpm install --frozen-lockfile --offline
RUN NITRO_PRESET=node-server pnpm run build

FROM node:24-slim
WORKDIR /app
COPY --from=build /app/.output ./.output
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
