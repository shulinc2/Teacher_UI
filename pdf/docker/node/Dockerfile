# Use a lightweight Node image
FROM node:22-alpine

# Create app directory
WORKDIR /usr/src/app

# 1) Copy package manifests and install production deps only
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# 2) Copy the server script that serves static files and proxies OCR
COPY server.js ./

# 3) Copy your static frontend into a public/ folder
COPY public/ ./public/

# Expose the port your app runs on
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
