# Use the official Node.js image as the base image
FROM node:20-alpine AS base

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install dependencies only when needed
FROM base AS dependencies
# Copy the root package.json and package-lock.json
COPY package.json package-lock.json ./
# Copy the app-specific package.json
COPY apps/web/runner/package.json ./apps/web/runner/
# Install dependencies for the entire monorepo
RUN npm ci --legacy-peer-deps --verbose

# Build the application
FROM base AS builder
# Copy the entire monorepo into the container
COPY . .
# Copy the installed node_modules from the dependencies stage
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
# Build the Next.js app
RUN npm run build --workspace=apps/web/runner --verbose

# Production image, copy only the necessary files and run the application
FROM base AS runner
ENV NODE_ENV production

# Copy the built application and node_modules
COPY --from=builder /usr/src/app/apps/web/runner/.next ./.next
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps/web/runner/public ./public
COPY --from=builder /usr/src/app/apps/web/runner/package.json ./package.json

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]