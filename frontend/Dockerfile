# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first
COPY ./package.json ./package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Ignore TypeScript errors
ENV NEXT_PUBLIC_IGNORE_TS_ERRORS=true

# Build frontend
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
