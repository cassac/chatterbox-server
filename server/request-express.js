var express = require('express');
var app = express();
var fs = require('fs');

var _messages = [];

app.use(express.static('client'));

app.get('/classes/messages', function(req, res) {
  res.json({results: _messages});
  res.end();
});

app.post('/classes/messages', function(req, res) {
  req.on('data', function(data) {
    jsonData = JSON.parse(data.toString());
    _messages.push(jsonData);
  });
  res.json({results: _messages});
  res.end();
});

app.options('/classes/messages', function(req, res) {
  res.send('GET, POST, OPTIONS, DELETE, PUT');
});

app.get('/', function(req, res) {
  res.write(fs.readFileSync('././client/index.html'));
});

app.listen(8080);