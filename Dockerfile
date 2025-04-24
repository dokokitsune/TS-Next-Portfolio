FROM node:lts-alpine AS base 

# Dependencies Stage
FROM base AS deps
WORKDIR /app
COPY yarn.lock ./
RUN yarn install --frozen-lockfile

#Builder Stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG AWS_REGION
ENV AWS_REGION=${AWS_REGION}

RUN yarn build

# Production image
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Change to use standalone server
CMD ["node", "server.js"]
