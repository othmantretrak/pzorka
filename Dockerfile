# Use a lightweight Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency files first (for better caching)
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy all app files
COPY . .

# Expose the port your app listens on
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
