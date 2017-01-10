// File: client.js
// The client-side portion of the PiTemp web app.
// This file is one of four: server.js, client.js, bmp180.js and index.html.

/* global $ */

window.onload = function () {
  var url;
  var inputID = ['temp'];  // the inputs used

  // Display some initial (place holder) text
  $('#input_' + inputID[0]).html('Loading...');

  // Every five seconds, display the sensor temperature
  setInterval(function () {
    url = document.URL + 'inputs/' + inputID[0];
    console.log('making API call ' + url);

    $.getJSON(url, function (data) {
      console.log('API response received. Input ' + data.input + ' value = ' + data.value);
      $('#input_' + data.input).html(data.value);
    });
  }, 5000);
};

// EOF

