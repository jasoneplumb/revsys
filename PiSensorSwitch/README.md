README

A web API app server that can run on a RaspberryPi with a BMP180 sensor at 0x77 on the I2C bus which monitors the sensor temperature from a web client.

App uses Node & Express to provide a RESTful API by responding to ajax requests, and returns a JSON object which can be directly referenced in the client.

To start, download the source files into a new directory on the RPi, and run node from command line with the server.js file as argument
    > node server.js
This starts the http server on localthost using port 3000

To view the exposed data, browse to http://[your RPi's IP Address]:3000, the index.html will be loaded and displayed which 
loads the client.js which implements the JSON based query logic to trigger the API on the server.
