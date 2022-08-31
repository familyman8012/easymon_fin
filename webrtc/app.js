const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

server.listen(3000, () => {
  console.log('Socket IO server listening on port 3000');
});

app.get('/', function (req, res) {
  console.log('good');
  res.sendFile('index.html', {root: __dirname});
});
