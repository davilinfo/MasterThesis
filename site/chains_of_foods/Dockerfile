# multi-stage build for a CRA application

# 1. build stage
# revert to Node 12.22.12 as requested
FROM node:12.22.12-alpine AS build
WORKDIR /app

# copy package definitions and install deps first so layer can be cached
COPY package.json package-lock.json* ./

# add build tools and libs required for sodium-native
RUN apk add --no-cache build-base python3 libsodium-dev

RUN npm ci --only=production || npm install

# install sodium-native manually (build deps installed earlier)
RUN npm install sodium-native --no-save || true

# webpack build sometimes fails to resolve require-addon even if it's a
# dependency of sodium-native, so add a harmless stub module to node_modules
RUN mkdir -p node_modules/require-addon && \
    printf "module.exports = {};" > node_modules/require-addon/index.js

# copy the rest of the source
COPY . .

# build the static assets
RUN npm run build

# 2. runtime stage
FROM nginx:stable-alpine

# remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# copy build output from previous stage
COPY --from=build /app/build /usr/share/nginx/html

# optional: copy a custom nginx config if you have one
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
