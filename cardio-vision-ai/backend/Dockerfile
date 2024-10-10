# Backend Dockerfile

# Use Node.js 19 as the base image
FROM node:19

# Set the working directory inside the container to /backend
WORKDIR /backend

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code to the container
COPY . .

# Expose the port that the backend will listen on
EXPOSE 8000

# Start the backend server
CMD ["npm", "start"]
