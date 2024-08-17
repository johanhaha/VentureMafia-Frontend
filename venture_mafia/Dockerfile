# Step 1: Build the React app with Node.js
FROM node:14 AS build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to install dependencies
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the React app for production
RUN npm run build

# Step 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the build output from the previous stage to Nginx's html directory
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Copy the public directory to the Nginx directory (if needed)
COPY public /usr/share/nginx/html/public

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 for the application
EXPOSE 8080

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
