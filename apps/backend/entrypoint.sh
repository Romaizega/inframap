#!/bin/sh
echo "Running migrations..."
cd apps/backend && npx prisma migrate deploy --schema=prisma/schema.prisma
echo "Starting server..."
exec node dist/src/index.js