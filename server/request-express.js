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
  console.log(_messages, _rooms);
  console.log(req.url);
  console.log(urlParser.endpointData(req.url, endpoints));
  res.json({results: _messages, rooms: _rooms});
  res.end();
});

app.post('/classes/messages', function(req, res) {
  req.on('data', function(data) {
    jsonData = JSON.parse(data.toString());
    jsonData['createdAt'] = Date.now();
    var endpoint = urlParser.endpointData(req.url, endpoints);
    endpoint.push(jsonData);
    _rooms[jsonData.roomname] = true;
    // _messages.push(jsonData);
  });

  // fs.exists('./data.txt', function(err, data) {
  //   if (err) {
  //     fs
  //   }
  // })

  fs.writeFile('data.txt', endpoints, function(err, data) {

    console.log('saved to file!');
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
  console.log('stared!');
  // if(fs.exists('./data.txt'))
  // endpoints = fs.readFileSync('./data.txt');
});