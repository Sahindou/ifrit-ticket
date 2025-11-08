#!/bin/sh
set -e

echo "🔄 Running database migrations..."
node -r tsconfig-paths/register dist/core/config/migrate.js

echo "🚀 Starting server..."
node  dist/index.js