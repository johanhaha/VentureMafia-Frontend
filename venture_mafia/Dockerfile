# Use the official Node.js image to build the React app
FROM node:14 AS build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Use a lightweight web server to serve the static files
FROM nginx:alpine

# Copy the build output to the Nginx public directory
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose port 8080
EXPOSE 8080

# Start Nginx and set it to listen on port 8080
CMD ["sh", "-c", "sed -i 's/listen  .*/listen 8080;/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
