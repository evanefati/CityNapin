FROM node:4.8.0

WORKDIR /app

ADD package.json /app/package.json
RUN npm install

ADD . /app

ENV SERVER_URL http://nearme.quanlabs.com/parse
ENV PUBLIC_SERVER_URL http://nearme.quanlabs.com/parse
ENV APP_NAME NearmeApp
ENV MAILGUN_API_KEY key-004454825826125a446123cf1ca7d3c3
ENV MAILGUN_DOMAIN quanlabs.com
ENV MAILGUN_FROM_ADDRESS 'QuanLabs <info@quanlabs.com>'
ENV MAILGUN_TO_ADDRESS 'info@quanlabs.com'

CMD [ "npm", "start" ]

