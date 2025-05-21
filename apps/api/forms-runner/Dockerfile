# Stage 1: Install dependencies
FROM node:20-alpine AS dependencies
WORKDIR /usr/src/app

# Copy the root package.json and package-lock.json
COPY package.json package-lock.json ./
COPY apps/api/forms-runner/package.json ./apps/api/forms-runner/

# Install production dependencies only
RUN npm ci --legacy-peer-deps

# Stage 2: Build the application
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Copy the entire project into the container
COPY . .

# Copy the installed production dependencies from the dependencies stage
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

# Build the application
RUN npm run build --workspace=apps/api/forms-runner --verbose
RUN echo "Listing contents of /usr/src/app/apps/api/forms-runner/dist:" && ls -la /usr/src/app/apps/api/forms-runner/dist

# Stage 3: Create the production image
FROM node:20-alpine AS production
WORKDIR /usr/src/app

# Copy only the necessary files from the builder stage
COPY --from=builder /usr/src/app/apps/api/forms-runner/dist ./dist
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["node", "-r", "tsconfig-paths/register", "dist/apps/api/forms-runner/src/index.js", "--project", "dist/apps/api/forms-runner/tsconfig.json"]