
### STAGE 1: Build ###

# We label our stage as ‘builder’
FROM node:10-alpine as builder

COPY package.json package-lock.json ./

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build

RUN npm ci && mkdir -p /usr/var/app && mv ./node_modules /usr/var/app

WORKDIR /usr/var/app

COPY . .

ARG REDIRECT_URL
ARG AUTH0_CLIENT_ID
ARG AUTH0_DOMAIN
ARG BACKEND_URL

ENV REDIRECT_URL=$REDIRECT_URL
ENV AUTH0_CLIENT_ID=$AUTH0_CLIENT_ID
ENV AUTH0_DOMAIN=$AUTH0_DOMAIN
ENV BACKEND_URL=$BACKEND_URL


RUN npx parcel build ./index.html


### STAGE 2: Setup ###

FROM nginx:1.14.1-alpine

## get nginx conf from underlying server
VOLUME [ "/etc/nginx/conf.d"]

## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /usr/var/app/dist /var/www/html

CMD ["nginx", "-g", "daemon off;"]

