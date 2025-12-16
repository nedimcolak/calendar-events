#!/bin/sh
set -e

echo "Running Prisma migrations..."
npx prisma migrate deploy
npx prisma generate

echo "Prisma migrations completed!"
echo "Starting the application..."
exec npm run dev
