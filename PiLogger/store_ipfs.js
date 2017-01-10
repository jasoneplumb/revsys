// File: store_ipfs.js 
// A crude ipfs storage implementation of the logging abstraction.

var ipfsapi = require( 'ipfs-api' );
var ipfs = ipfsapi( process.env['IPFS'] );

// Create an empty object to store log names and related authorizatio$
var log = {};

var streamToString = function( stream, callback ) {
    var str = '';
    stream.on( 'data', function( chunk ) {
        str += chunk;
    });
    stream.on( 'end', function() {
        callback( str );
    });
}

// Pass the contents of the named log to the provided callback
function getByHash( inHash, callback )
{
    ipfs.files.get(
        inHash,
        function ( err, stream ) {
            if ( err ) { throw err; } else {
                stream.on('data', ( file ) => {
                    streamToString( file.content, callback );
                });
            }
        }
    );
}

// Pass the contents of the named log to the provided callback
function get( inLogName, callback )
{
    getByHash( log[ inLogName ], callback );
}

module.exports = 
{
    // Create a named log which can recieve subsequent data points
    create: function ( inLogName, inDescription, inValue ) 
    {
        // Create a new log file (w/ header), and save the cryptographic hash
        var request = [{
            path: '/PiLogger/' + inLogName + '.log',
            content: '{"' + inDescription + '":[{"UTC70":"' +
                new Date().getTime().toString() +
                '","value":"' + inValue + '" }]}'
        }]
        ipfs.files.add( request, function ( err, files ) {
            if ( err ) { throw err; } else { 
                log[ inLogName ] = files[ 0 ].hash; 
                console.log( inLogName + ' log hash is: ' + log[ inLogName ] );

/*                // For debugging purposes, dump the log
                get( inLogName,
                    ( str ) => { console.log(' '); console.log( str ) }
                );
*/            }
        }); 
    },

    // Append the provided time series data point to the log file
    capture: function ( inLogName, inValue ) 
    {
        // Construct a new entry according to the provided arguments
        // and append it to the end of the log 
        get( inLogName, function( str ) {
            // Create a new log file (w/ header), and save the cryptographic hash
            var request = [{
                path: '/PiLogger/' + inLogName + '.log',
                content: str.slice( 0, -2 ) +
                    ', {"UTC70":"' + new Date().getTime().toString() +
                    '","value":"' + inValue + '"}]}',
            }]
            ipfs.files.add( request, function ( err, files ) {
                if ( err ) { throw err; } else { 
                    log[ inLogName ] = files[ 0 ].hash; 
                    console.log( inLogName + ' log hash is: ' + log[ inLogName ] );

/*                    // For debugging purposes, dump the log
                    get( inLogName,
                        ( str ) => { console.log(' '); console.log( str ) }
                    );
*/                }
            }); 
        });
    },

    getByHash: function ( inHash, callback ) { getByHash( inHash, callback ) }
}

// EOF
