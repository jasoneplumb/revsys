// File: test_ipfs.js
// A node.js app to verify log is formatted as a valid JSON string.
// The log file is generated by server.js (e.g. via store_ipfs.js).

// Load the built-in file system library
var store = require('./store_ipfs');

// Ensure that the caller passed an argument
var args = process.argv;
if (!args[2]) { // Arg 0 and 1 are 'node' and 'test_log.js'
  throw new Error('Error: You must specifiy the ipfs hash as an argument.');
}

// Read the file contents into a string, show the result
process.stdout.write('\nLoading contents of the log into a string...');
store.getByHash(args[2], (str) => {
  console.log('done.');
  console.log('The resulting string follows:\n' + str);

    // Parse the (JSON) string into an object, show the result
  process.stdout.write('\nParsing the string into an object...');
  var obj = JSON.parse(str);
  console.log('done.');
  console.log('The object resulting from JSON.parse follows:\n' +
        JSON.stringify(obj, null, 4));
});

// EOF
