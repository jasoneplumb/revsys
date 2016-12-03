// File: bmp180.js 
// A library for accessing and using the data from the Bosch bmp180 sensor.
// More information about the BMP180 can be found here:
// https://www.bosch-sensortec.com/bst/products/all_products/bmp180
// This file is one of four: server.js, client.js, bmp180.js and index.html.
// To use, execute 'node server.js' then open a browser to the ip and port e.g. http://192.168.0.78:3000
// Temp equations based on the following source: http://wmrx00.sourceforge.net/Arduino/BMP085-Calcs.pdf
// The structure and form of this web app was based on information at the following page:
// http://www.robert-drummond.com/2013/05/08/how-to-build-a-restful-web-api-on-a-raspberry-pi-in-javascript-2/

var rasp2c = require('rasp2c'); // Used to read the sensor data via I2C at the provided address (e.g. 0x77)

// Delay function. The bmp180 sensor requires that you wait 4.5ms after requesting a sensor reading before
// an accurate value can be expected.
function sleep( milliseconds ) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

module.exports = {

  temperature: function ( inDeviceAddress, inPrecision, outObject ) {
    var c5, c6, mC, mD;
    var tempC, tempF;
    var tU, a;

    // First read and setup the temperature calculation according to the calibration values
    rasp2c.dump( inDeviceAddress, '0xB2-0xBF', function( err, result ) {
      if (err) {
        console.log(err);
      } else {
        c5 = ( result[0] * 256 + result[1] ) * Math.pow( 2, -15 ) / 160;
        c6 = result[2] * 256 + result[3];
        {
          var MC, MD;

          MC = result[10] * 256 + result[11];
          if ( MC > 32767 ) MC = MC - 65536; // Convert to a signed 16-bit value.
          mC = ( Math.pow( 2, 11 ) / Math.pow( 160, 2 ) ) * MC;

          MD = result[12] * 256 + result[13];
          if ( MD > 32767 ) MD = MD - 65536; // Convert to a signed 16-bit value
          mD = MD / 160;
        }

        // Then request a sensor reading by writing code 0x2E to address 0xF4
        rasp2c.set( inDeviceAddress, '0xF4', '0x2E', function( err, result ) {
          if ( err ) {
            console.log( err );
          } else {

            sleep( 5 ); // The sensor is ready to read 4.5 ms after the request (set)

            rasp2c.dump( inDeviceAddress, '0xF6-0xF7', function( err2, result2 ) {
              if ( err2 ) {
                console.log( err2 );
              } else {
                tU = result2[0] * 256 + result2[1];
                a = ( tU - c6 ) * c5;
                temp = a + ( mC / ( a + mD ) );

                temp = 32 + ( 9 / 5 ) * temp; // Convert from C to F.

                // Write value to provided object
                outObject.value = temp.toFixed( inPrecision ).toString(); // Store value as a string
              }
            });
          }
        });
      }
    });
  }
};

// EOF
