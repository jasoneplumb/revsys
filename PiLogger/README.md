README

A web API app server that can run on a RaspberryPi which monitors and controls the green built-in LED from a Web client.

App uses IFPS, Node & Express. 

The app provides a RESTful API responding to ajax requests, and returns a JSON object which can be directly referenced on the client.
It also logs state changes to a cloud server which is configured to service the IPFS API. The initialization of IPFS within store_ipfs.js uses an evironment variable for security purposes. The environment variable is declared as follows:
    export IPFS="/ip4/127.0.0.1/tcp/5001"
Of course, if your cloud service is running on a remote machine you would use the remote address instead of the localhost address (127.0.0.1).

To start, download the source files into a new directory on the RPi, and as an administrator, run node from command line with the server.js file as argument
    > node server.js
This starts the http server on localthost using port 3000

To view the exposed data, browse to http://[your RPi's IP Address]:3000, the index.html will be loaded ad displayed (served by server.js) 
index.html loads the client.js file which contains the JSON query logic.
