// File: server.js 
// The server-side portion of the PiTemp web app.
// This file is one of three: server.js, client.js and index.html.
// To use, execute 'node server.js' then open a browser to the ip and port e.g. http://192.168.0.78:3000
// Temp equations based on the following source: http://wmrx00.sourceforge.net/Arduino/BMP085-Calcs.pdf
// The structure and form of this web app was based on information at the following page:
// http://www.robert-drummond.com/2013/05/08/how-to-build-a-restful-web-api-on-a-raspberry-pi-in-javascript-2/

// Use the following libraries. Before use, these must be installed (at least locally) using npm.
var rasp2c = require('rasp2c'); // Used to read the sensor data via I2C e.g. at 0x77
var express = require('express'); // Simple web app service

// Start an instance of the Express service
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

// Delay mechanism used to wait for sensor readiness
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
};

// Read and store the temp every five seconds
setInterval( function () {
  var c5, c6, mC, mD;
  var tempC, tempF;
  var tU, a;

  // First read and setup the temperature calculation according to the calibration values
  rasp2c.dump('0x77', '0xB2-0xBF', function(err, result) {
    if (err) {
      console.log(err);
    } else {
      c5 = (result[0] * 256 + result[1]) * Math.pow(2, -15) / 160;
      c6 = result[2] * 256 + result[3];
      {
        var MC, MD;

        MC = result[10] * 256 + result[11];
        if (MC > 32767) MC = MC - 65536; // convert to a signed 16-bit value.
        mC = ( Math.pow(2, 11) / Math.pow(160, 2) ) * MC;

        MD = result[12] * 256 + result[13];
        if (MD > 32767) MD = MD - 65536; // convert to a signed 16-bit value
        mD = MD / 160;
      }

      // Then request a sensor reading by writing code 0x2E to address 0xF4
      rasp2c.set('0x77', '0xF4', '0x2E', function(err, result) {
        if (err) {
          console.log(err);
        } else {

          sleep(5); // The sensor is ready to read 4.5 ms after the request (set)

          rasp2c.dump('0x77', '0xF6-0xF7', function(err2, result2) {
            if (err2) {
              console.log(err2);
            } else {
              tU = result2[0] * 256 + result2[1];
              a = (tU - c6) * c5;
              tempC = a + (mC / (a + mD));
              tempF = 32 + (9/5) * tempC;

              inputs[0].value = tempF.toFixed(2).toString(); // store value as a string
              console.log(inputs[0].value);
            }
          });
        }
      });
    }
  });
}, 5000);

// EOF
