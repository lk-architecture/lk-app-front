[![Build Status](https://travis-ci.org/lk-architecture/lk-app-front.svg?branch=master)](https://travis-ci.org/lk-architecture/lk-app-front)

# lk-app-front

## Development environment setup

After cloning the repository, run `npm install` to install all dependencies and
`npm run dev` to start the development server.

## Configuration

The application can be configured using a `.env` file. Variables declared in the
file will become available in the `window.APP_CONFIG` object (provided
`/app-config.js` is included in the `app/main.html` source file).

Configuration options:
- `AUTH0_CLIENT_ID`
- `AUTH0_DOMAIN`
