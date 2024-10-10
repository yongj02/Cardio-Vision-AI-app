# Frontend Dockerfile

# Use Node.js 19 as the base image for building the frontend
FROM node:19 AS build

# Set the working directory inside the container to /frontend
WORKDIR /frontend

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code to the container
COPY . .

# Build the frontend
RUN npm run build

# Use a smaller image to serve the frontend
FROM node:19 AS production

# Install a simple static file server
RUN npm install -g serve

# Copy the built frontend from the previous stage
COPY --from=build /frontend/build /app

# Expose the port that the frontend will listen on
EXPOSE 3000

# Serve the frontend
CMD ["serve", "-s", "/app", "-l", "3000"]
