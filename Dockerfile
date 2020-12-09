FROM node:12

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

COPY app/package.json app/package.json
COPY app/package-lock.json app/package-lock.json

COPY admin/package.json admin/package.json
COPY admin/package-lock.json admin/package-lock.json

COPY trackcovid-js/package.json trackcovid-js/package.json
COPY trackcovid-js/package-lock.json trackcovid-js/package-lock.json

# COPY trackcovid-js ./trackcovid-js/

RUN npm ci --only=production

WORKDIR /usr/src/app/app
RUN npm ci --only=production

WORKDIR /usr/src/app/admin
RUN npm ci --only=production

WORKDIR /usr/src/app/trackcovid-js
RUN npm ci --only=production

WORKDIR /usr/src/app/

COPY admin/ admin/

COPY trackcovid-js/ trackcovid-js/

RUN cd admin && npm run build

COPY app/ app/

RUN cd app && npm run build

COPY . .

RUN npm run build-env

CMD ["node", "index.js"]