FROM node:6
MAINTAINER Wattellina <wattellina@mondora.com>

ADD . /lk-app-front
WORKDIR /lk-app-front
RUN npm install
RUN npm run build

EXPOSE 8080
CMD ["npm", "start"]
