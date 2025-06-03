# Stage 1: Install development dependencies
FROM node:20-alpine AS development-dependencies-env
WORKDIR /app
# Copy the root package.json and package-lock.json
COPY package.json package-lock.json ./
# Copy the app-specific package.json
COPY apps/web/designer/package.json ./apps/web/designer/
# Install dependencies for the entire monorepo
RUN npm ci --legacy-peer-deps

# Stage 2: Build the application
FROM node:20-alpine AS build-env
WORKDIR /app
# Copy the entire monorepo into the container
COPY . .
# Copy the installed node_modules from the development dependencies stage
COPY --from=development-dependencies-env /app/node_modules ./node_modules
# Build the React app
RUN npm run build --workspace=apps/web/designer

# Stage 3: Production image
FROM node:20-alpine
WORKDIR /app
# Copy the root package.json and package-lock.json
COPY --from=build-env /app/apps/web/designer/package.json ./
COPY --from=build-env /app/apps/web/designer/package-lock.json ./
COPY --from=build-env /app/apps/web/designer/app/run.sh ./
RUN chmod +x run.sh
# Copy the installed production node_modules
COPY --from=build-env /app/node_modules ./node_modules
# Copy the built application
COPY --from=build-env /app/apps/web/designer/build ./build
RUN npm install -g serve
# Expose the port the app runs on
EXPOSE 443
# Start the application
CMD ["sh", "run.sh"]