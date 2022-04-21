FROM NODE

WORKDIR /heart_engine

COPY . .

RUN npm install

EXPOSE 80

CMD [ 'node', 'app/index' ]