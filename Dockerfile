FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=9003

EXPOSE 9003

CMD ["node", "index.js"]
