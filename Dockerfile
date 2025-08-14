# Use the official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package*.json files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the current directory contents into the container
COPY . .

# Build the application
RUN npm run build

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Run the app
CMD ["npm", "start"]