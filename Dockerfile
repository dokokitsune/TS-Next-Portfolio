FROM node:22.11-alpine 

WORKDIR /app

COPY package*.json ./
#installs node_modules
RUN npm ci


COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "node", ".next/standalone/server.js" ]



