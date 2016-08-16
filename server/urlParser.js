var endpointData = function(requestURL, endpoints) {
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

exports.endpointData = endpointData;