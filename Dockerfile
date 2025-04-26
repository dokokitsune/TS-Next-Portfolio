FROM node:lts-alpine AS base 

# Dependencies Stage
FROM base AS deps
WORKDIR /app
COPY package*.json  ./
RUN npm ci
#Builder Stage
FROM base AS builder
WORKDIR /app


ARG AWS_REGION_ARG
ENV AWS_REGION=${AWS_REGION_ARG}

COPY --from=deps /app/node_modules ./node_modules
COPY . .


RUN --mount=type=secret,id=aws,target=/root/.aws/credentials \
    --mount=type=secret,id=aws_config,target=/root/.aws/config \
    sh -c ' \
        echo "--- Debug: Mounting AWS Secrets ---" && \
        echo "Config file content:" && \
        cat /root/.aws/config && \
        echo "Credentials file content:" && \
        cat /root/.aws/credentials && \
        echo "--- End Debug ---" && \
        \
        echo "Exporting AWS credentials from mounted secret file..." && \
        export AWS_ACCESS_KEY_ID=$(grep aws_access_key_id /root/.aws/credentials | cut -d= -f2 | xargs) && \
        export AWS_SECRET_ACCESS_KEY=$(grep aws_secret_access_key /root/.aws/credentials | cut -d= -f2 | xargs) && \
        export AWS_SESSION_TOKEN=$(grep aws_session_token /root/.aws/credentials | cut -d= -f2 | xargs) && \
        \
        echo "Running npm build..." && \
        npm run build \
    '
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
