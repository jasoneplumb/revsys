// File: store_local.js
// A simple local storage implementation of the logging abstraction.

var fs = require('fs');

module.exports =
{
    // Create a named log which can recieve subsequent data points
  create: function (inLogName, inDescription, inValue) {
        // Replace existing file (if it exists), create the log file
        // and write a fuly valid header (in case of no calls to logCapture).
    fs.writeFile('./' + inLogName + '.log',
            '{"' + inDescription + '":[{"UTC70":"' +
            new Date().getTime().toString() +
            '","value":"' + inValue + '"}]}',
            (err) => { if (err) { throw err; } });
  },

    // Append the provided time series data point to the log file
  capture: function (inLogName, inValue) {
    var fileName = './' + inLogName + '.log';
    fs.open(fileName, 'r+', function (err, file) {
      if (err) { throw err; } else {
                // Truncate the file (in order to remove
                // the last two characters)
        var fileStats = fs.statSync(fileName);
        var fileLength = fileStats[ 'size' ];
        fs.ftruncate(file, fileLength - 2,
                    (err) => {
                      if (err) { throw err; } else {
                        // Append a new entry, and close the JSON string
                        fs.appendFile(fileName, ', {"UTC70":"' +
                            new Date().getTime().toString() +
                            '","value":"' + inValue + '"}]}',
                            (err) => { if (err) { throw err; } });
                      }
                    });
      }
    });
  }
};

// EOF
