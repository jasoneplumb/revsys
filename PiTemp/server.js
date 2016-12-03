// File: server.js 
// The server-side portion of the PiTemp web app.
// This file is one of four: server.js, client.js, bmp180.js and index.html.
// To use, execute 'node server.js' then open a browser to the ip and port e.g. http://192.168.0.78:3000
// Temp equations based on the following source: http://wmrx00.sourceforge.net/Arduino/BMP085-Calcs.pdf
// The structure and form of this web app was based on information at the following page:
// http://www.robert-drummond.com/2013/05/08/how-to-build-a-restful-web-api-on-a-raspberry-pi-in-javascript-2/

// Include the bmp180 library
var bmp180 = require('./bmp180');

// Start an instance of the Express service
var express = require('express'); // Simple web app service
var app = express();
app.listen(3000); // Express services typically use port 3000

// Return the related index.html file (located in the same direcory as this file).
app.use(express.static(__dirname));

// input object
var inputs = [ { input: 'temp', value: null } ];

// Express route for incoming requests for a single input
app.get('/inputs/:id', function (req, res) {
  var i;
  for (i in inputs){
    if ((req.params.id === inputs[i].input)) {
      // send to client an inputs object as a JSON string
      res.send(inputs[i]);
      return;
    }
  }

  console.log('invalid input port');
  res.status(403).send('dont recognise that input port number ' + req.params.id);
});

// Express route for incoming requests for a list of all inputs
app.get('/inputs', function (req, res) {
  // send array of inputs objects as a JSON string
  console.log('all inputs');
  res.status(200).send(inputs);
});

// Express route for any other unrecognised incoming requests
app.get('*', function (req, res) {
  res.status(404).send('Unrecognised API call');
});

// Express route to handle errors
app.use(function (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send('Oops, Something went wrong!');
  } else {
    next(err);
  }
});

// Read and store the temp every five seconds
setInterval( function () {
  bmp180.temperature( '0x77', 2, inputs[0] );
}, 5000);

// EOF
