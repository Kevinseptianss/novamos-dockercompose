FROM node:23.5.0

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

COPY start.sh ./

RUN chmod +x start.sh

EXPOSE 3000

CMD ["./start.sh"]