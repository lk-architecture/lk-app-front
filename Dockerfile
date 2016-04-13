FROM node
MAINTAINER Wattellina <wattellina@mondora.com>

ADD . /lk-app-front
WORKDIR /lk-app-front
RUN npm install

EXPOSE 8080
CMD ["npm", "start"]
