# ---- Base ----
# Use an official Node.js runtime as a parent image
FROM node:20-alpine AS base
WORKDIR /usr/src/app
# Install pnpm globally
RUN npm install -g pnpm

# ---- Dependencies ----
# Install app dependencies using pnpm
FROM base AS dependencies
COPY package.json pnpm-lock.yaml ./
# Install all dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile --prod=false

# ---- Build ----
# Build the application
FROM base AS build
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
# Run the build command defined in your package.json
RUN pnpm build

# ---- Release ----
# Create the final, smaller image for release
FROM node:20-alpine AS release
WORKDIR /usr/src/app
# Install pnpm globally
RUN npm install -g pnpm
# Copy package.json and pnpm-lock.yaml to install only production dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
# Copy the built application from the build stage
COPY --from=build /usr/src/app/dist ./dist
# Expose the port the app runs on (adjust if your app uses a different port, e.g., 3001 for this service)
EXPOSE 3001
# Command to run the application
# Ensure your main entry point is dist/main.js
CMD ["node", "dist/main.js"]
