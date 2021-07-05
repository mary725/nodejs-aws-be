# ---- Base Node image ----
FROM node:14 as base
WORKDIR /app

# ---- Dependencies ----
FROM base as dependencies
COPY package*.json ./
RUN npm install

# ---- Copy Files/Build ----
FROM dependencies as build
COPY . .
RUN npm run build

# ---- Release with Alphine ----
FROM node:14-alpine as release
WORKDIR /app
ENV NODE_ENV=production
COPY --from=dependencies /app/package*.json ./
# Install app dependencies
# "RUN apk update && apk add bash (to run bash in container: docker run -i -t --rm --name test myimage bash)
RUN npm install --only=production && npm cache clean --force
# Add built source files
COPY --from=build /app/dist ./dist
EXPOSE 4000
# ENTRYPOINT ["npm", "run"]
# CMD ["start:prod"] - "start:prod" - default param for ["npm", "run"], can be overridden when starting the container
CMD ["npm", "run", "start:prod"]
