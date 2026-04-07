# syntax=docker/dockerfile:1
FROM node:20-slim AS runner
WORKDIR /app

# Switch to the non-root 'node' user that is already created by the base image (UID 1000).
# This perfectly maps to typical host user UID, preventing permission issues with mounted volumes.
USER node

EXPOSE 3000
CMD ["npm", "run", "dev"]
