# Node.js Alpine lightweight image
FROM node:20-alpine

# Working directory set karein
WORKDIR /app

# Package files copy karein
COPY package*.json ./

# Dependencies install karein
RUN npm install --production

# Baki saara server code copy karein
COPY . .

# Backend port expose karein
EXPOSE 5000

# Server start command
CMD ["node", "server.js"]