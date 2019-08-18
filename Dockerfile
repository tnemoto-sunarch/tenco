FROM node:12.8.0-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build:prod
CMD ["yarn", "run", "start:prod"]
