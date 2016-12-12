// File: server.js 
// The server-side portion of the PiLED web app.
// This file is one of three: server.js, client.js and index.html.
// To use, execute 'node server.js' then open a browser to the ip and port e.g. http://192.168.0.78:3000
// The structure and form of this web app was based on information at the following page:
// http://www.robert-drummond.com/2013/05/08/how-to-build-a-restful-web-api-on-a-raspberry-pi-in-javascript-2/

var fs = require('fs');

// Start an instance of the Express service. Must first be installed using 'npm install express'
var express = require('express'); // Simple web app service
var app = express();
app.listen(3000); // Express services typically use port 3000

// Return the related index.html file (located in the same direcory as this file).
app.use(express.static(__dirname));

// input object
var inputs = [ { input: 'LED_status', value: null } ];
var requests = [ { input: 'LED_toggle', value: null } ];

var LED_state = 0;

// Turn the LED off initially
var fileName = "/sys/class/leds/led0/brightness";
fs.writeFile( fileName, '0' );

// Express route for incoming requests for a single input
app.get('/inputs/:id', function (req, res) {
  var i;
  for (i in inputs){
    if ((req.params.id === inputs[i].input)) {
      // send to client an inputs object as a JSON string
      res.send(inputs[i]);
      return;
    }
    else if ((req.params.id === requests[i].input)) {

      // Toggle the value of the LED
      LED_state ^= 1;

      // Set the LED brightness to reflect the correct state
      // Note that this method of controlling the built-in LED requires
      // that the Web App is run as an administrator, otherwise the file
      // operations will fail
      var fileName = "/sys/class/leds/led0/brightness";
      // Then recreate the file so that it contains the correct brightness value
      if ( LED_state === 1 ) {
        fs.writeFile( fileName, '1' );
      } else {
        fs.writeFile( fileName, '0' );
      }

      // Finally, send to client an requests object as a JSON string
      res.send(requests[i]);
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

// Read and store the LED status every half second
setInterval( function () {
  if ( LED_state === 0 ) {
    inputs[0].value = "off";
  } else {
    inputs[0].value = "on";
  }
}, 500);

// EOF
