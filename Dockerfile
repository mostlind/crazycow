
### STAGE 1: Build ###

# We label our stage as ‘builder’
FROM node:10-alpine as builder

COPY package.json package-lock.json ./

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build

RUN npm ci && mkdir -p /usr/var/app && mv ./node_modules /usr/var/app

WORKDIR /usr/var/app

COPY . .

## Build the angular app in production mode and store the artifacts in dist folder

RUN npx parcel build ./index.html


### STAGE 2: Setup ###

FROM nginx:1.14.1-alpine

## get nginx conf from underlying server
VOLUME [ "/etc/nginx/conf.d"]

## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /usr/var/app/dist /var/www/html

CMD ["nginx", "-g", "daemon off;"]

