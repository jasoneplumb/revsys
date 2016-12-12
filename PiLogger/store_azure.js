// File: store_azure.js
// A azure table storage implementation of the logging abstraction.
process.stdout.write( 'Loading Azure services...' );
var azure = require( 'azure' );
var tableService = azure.createTableService(
    new Buffer("http://revsys.core.windows.net").toString('base64'),
    new Buffer("1vxZ4SdPGd/GR6J6d6r8rWW+rHy0qsCMOvtRbtpA/FbcFjpTXT2JMlzkWy+qK6UgmmkoT0HdrccHxPVpq1C/SQ==").toString('base64')
);
console.log( 'done.' );

// Generate and return a Global Unique IDentifier
function genGUID() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

module.exports = 
{
    // Create a named log which can recieve subsequent data points
    create: function ( inLogName, inDescription, inValue ) {
        // Todo: Implement this. For now we will use an existing file.
    },

    // Append the provided time series data point to the log file
    capture: function ( inLogName, inValue ) {
        var GUID = genGUID(); // Ensure that the value is unique for each entry

        // Insert a new entry according to the provided data
        var data = {
            PartitionKey : inLogName.toLowerCase(),
            RowKey : GUID,
            Time : new Date().getTime().toString(),
            Value : inValue
        }

        // Todo: Fix the following call. Currently, it returns an error.
        tableService.insertEntity('PiLogger', data, function( err, entity, response ) {
            if ( err ) {
                console.log( err );
            } else {
                console.log( 'Inserted!' );
            }
        });

        return GUID;
    }
}

// EOF
