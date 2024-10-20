FROM node:20-alpine

EXPOSE 3333

WORKDIR /usr/src

COPY package.json /.

RUN npm install

COPY . .

CMD ["sh", "-c", "npm run build && node dist/main.js"]
