FROM node:lts-alpine

RUN apk update && apk add ffmpeg && rm -rf /var/cache/apk/*

RUN npm install -g pnpm

WORKDIR /app

COPY package.json ./

COPY . .

RUN pnpm install

RUN npx prisma generate

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]