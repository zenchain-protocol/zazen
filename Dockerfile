FROM node:lts
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
# Replace snap.manifest.json with snap.manifest.dev.json for development allowedOrigins
RUN rm -f snap.manifest.json && cp snap.manifest.dev.json snap.manifest.json
RUN yarn build
CMD ["yarn", "mm-snap", "serve"]