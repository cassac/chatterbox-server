/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var fs = require('fs');

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var endpoints = {
  'classes': {
    'messages': {headers: 'GET, POST, PUT, DELETE, OPTIONS', data: []},
    'room': {headers: 'GET, POST, OPTIONS, DELETE', data: []}
  },  
  'env': {
    'config.js': {headers: 'GET, OPTIONS', data: []}
  }
};
var endpointData = function(requestURL) {
  var points = requestURL.split('/');
  points.shift();
  var finalDestination = endpoints;
  points.forEach(function(point) {
    finalDestination = finalDestination[point];
    if (finalDestination === undefined) {
      return undefined;
    }
  });
  return finalDestination;
}; 
var requestHandler = function(request, response) {


  // Starts to serve static files
  // var htmlFile = fs.readFileSync('././client/index.html', 'utf8');
  // var appFile = fs.readFileSync('././client/scripts/app.js', 'utf8');
  // var jQueryFile = fs.readFileSync('././client/bower_components/jquery/dist/jquery.min.js', 'utf8');
  // var dir = fs.readdirSync('././client');
  // console.log('dir:', dir);
  // response.end(htmlFile);
  // response.write(htmlFile);
  // response.write(appFile);
  // response.write(jQueryFile);
  // response.end(htmlFile)
  // try {
  //   var enddata = endpointData(request.url);
  // } catch (err) {
  //   var enddata;
  // }

  var enddata = endpointData(request.url);

  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  var statusCode = 200;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';

  // returns 404 if enpoint does not exist or specific
  if (enddata === undefined || !Array.isArray(enddata.data)) {
    statusCode = 404;
    // left off here. incorrect endpoint kills server.
    response.writeHead(statusCode, headers);
    response.end('{"results":[]}');
  }

  if (enddata && request.method === 'POST' && enddata.headers.includes('POST')) {
    statusCode = 201;
    request.on('data', function(data) {
      var incomingData = JSON.parse(data.toString());
      enddata.data.push(incomingData);
      var room = endpoints.classes.room.data;
      if (room.indexOf(incomingData.roomname) < 0) {
        room.push(incomingData.roomname);
      }
    });
    response.writeHead(statusCode, headers);
    var returnData = {results: enddata.data};
    response.end(JSON.stringify(returnData));
  }

  if (enddata && request.method === 'GET' && enddata.headers.includes('GET')) {
    statusCode = 200;
    response.writeHead(statusCode, headers);
    var returnData = {results: enddata.data};
    response.end(JSON.stringify(returnData));
  }

  if (enddata && request.method === 'OPTIONS' && enddata.headers.includes('OPTIONS')) {
    statusCode = 200;
    response.writeHead(statusCode, headers);
    var returnData = {results: defaultCorsHeaders['access-control-allow-methods']};
    response.end(JSON.stringify(returnData));    
  }

  if (enddata && !enddata.headers.includes(request.method)) {
    statusCode = 405;
    headers['Content-Type'] = 'application/json';
    response.writeHead(statusCode, headers);
    response.end('{"results":[], "message": "Method not allowed"}');
  }
  // The outgoing status.
  // var statusCode = 200;

  // See the note below about CORS headers.
  

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.


  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  // response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // response.end('{"results":[]}');
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

exports.requestHandler = requestHandler;