README

A web API app server that can run on a RaspberryPi which monitors and controls the green built-in LED from the Web client.

App uses Node & Express that provide a RESTful API responding to an ajax request, and returns a JSON object which can be directly referenced in the client.

To start, download the source files into a new directory on the RPi, and as an administrator, run node from command line with the server.js file as argument
    > node server.js
This starts the http server on localthost using port 3000

To view the exposed data, browse to http://[your RPi's IP Address]:3000, the index.html will be loaded ad displayed (served by server.js) 
index.html loads the client.js file which contains the JSON query logic.
