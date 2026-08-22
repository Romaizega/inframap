FROM node:22-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install 
COPY . .
RUN cd apps/backend && npx prisma generate --schema=prisma/schema.prisma
RUN pnpm --filter backend build
RUN cp -r apps/backend/src/generated apps/backend/dist/src/generated
EXPOSE 3001
CMD ["pnpm", "--filter", "backend", "start"]