var express = require('express');
var app = express();
var fs = require('fs');
var urlParser = require('./urlParser.js');

var _messages = [];
var _rooms = {};

var endpoints = {
  'classes': {
    'messages': _messages,
    'room': _rooms
  },  
};

app.use(express.static('client'));

app.get('/classes/messages', function(req, res) {
  res.json({results: endpoints.classes.messages, rooms: endpoints.classes.rooms});
  res.end();
});

app.post('/classes/messages', function(req, res) {
  req.on('data', function(data) {
    jsonData = JSON.parse(data.toString());
    jsonData['createdAt'] = Date.now();
    var endpoint = urlParser.endpointData(req.url, endpoints);
    endpoint.push(jsonData);
    _rooms[jsonData.roomname] = true;
    fs.writeFile('data.txt', JSON.stringify(endpoints), function(err, data) {
      if (err) {
        throw err;
      }
    });
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

app.listen(8080, function() {
  console.log('starrrrted!');
  fs.exists('data.txt', (exists) =>{
    if (exists) {
      endpoints = JSON.parse(fs.readFileSync('data.txt').toString());
    }
  });
});