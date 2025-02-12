FROM node:23.5.0

WORKDIR /app

# Install curl to download dockerize
RUN apt-get update && apt-get install -y curl

# Download and install dockerize
RUN curl -sSL https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz \
    | tar -xz -C /usr/local/bin

# Copy package.json and package-lock.json
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

EXPOSE 3000

# Use dockerize to wait for the db service before running migrations and starting the server
CMD ["sh", "-c", "dockerize -wait tcp://db:5432 -timeout 30s && npm run migrate up && npm run start"]