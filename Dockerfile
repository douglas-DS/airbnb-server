FROM node:latest

RUN npm i -g @adonisjs/cli

WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3333

CMD ["npm", "start"]