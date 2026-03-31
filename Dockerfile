FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy server code
COPY server ./server
COPY client ./client

# Install client dependencies and build
WORKDIR /app/client
RUN npm install
RUN npm run build

# Go back to root
WORKDIR /app

# Build argument for environment
ARG REACT_APP_API_URL=http://localhost:5000

# Expose ports
EXPOSE 5000 3000

# Start both server and client
CMD ["sh", "-c", "npm start --prefix server & npm start --prefix client"]
