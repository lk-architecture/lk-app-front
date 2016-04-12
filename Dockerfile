FROM node
MAINTAINER Paolo Scanferla <paolo.scanferla@gmail.com>

ADD . /lk-app-front
WORKDIR /lk-app-front
RUN npm install
EXPOSE 8080
CMD ["npm", "run", "dev"]
