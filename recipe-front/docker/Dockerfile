# Use the official Node.js LTS Alpine image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json* ./

# Install dependencies
# Using --frozen-lockfile is recommended for CI/production, but fine for dev too
RUN npm install --frozen-lockfile

# Copy the rest of the application code
# This will be overlaid by the volume mount in docker-compose for development
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the development server
# The --hostname 0.0.0.0 flag was added to package.json earlier
CMD ["npm", "run", "dev"]
