FROM node:18 as builder

ENV NODE_ENV=production

WORKDIR /usr/src/app

# Copy package so we can do a clean install
COPY ./package.json ./package-lock.json ./
# Prevent the prepare stage with husky from running, install typescript and install packages
# https://github.com/typicode/husky/issues/914
RUN npm pkg delete scripts.prepare && \
  npm i -g typescript && \
  npm ci

# Copy and build the release
COPY . .
RUN sed -i '/import "dotenv\/config";/c\\' ./src/environment.ts && \
  tsc

# out final base
FROM node:18

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist dist
COPY --from=builder /usr/src/app/node_modules node_modules
# COPY --from=builder /usr/src/app/node_modules/ ./

# TODO - should probably register all the commands, would be my guess anyway

# TODO - audio should be mounted and I should be able to point at it
RUN echo [] > sound-database.json && \
  mkdir audio

CMD ["node", "dist/app.js"]