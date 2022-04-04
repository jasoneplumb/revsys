// File: client.js
// The client-side portion of the PiTemp web app.
// This file is one of four: server.js, client.js, bmp180.js and index.html.

/* global $ */

window.onload = function () {
  var url;
  var inputID = ['temp',
                 'LED_status'];  // the inputs used

  // Display some initial (place holder) text
  $('#input_' + inputID[0]).html('Loading temp...');
  $('#input_' + inputID[1]).html('Loading LED status...');

  // Every five seconds, display the sensor temperature
  setInterval(function () {

    temp_url = document.URL + 'inputs/' + inputID[0];
    $.getJSON(temp_url, function (data) {
//      console.log('API response received. Input ' + data.input + ' value = ' + data.value);
      $('#input_' + data.input).html(data.value);
    });

    LED_status_url = document.URL + 'inputs/' + inputID[1];
    $.getJSON(LED_status_url, function (data) {
//      console.log('API response received. Input ' + data.input + ' value = ' + data.value);
      $('#input_' + data.input).html(data.value);
    });

  }, 5000);
};

// Change the state (on, off) of the LED when called
function toggleLED () {
  var requestID = ['LED_toggle']; // The requests

  var url = document.URL + 'inputs/' + requestID[0];
  console.log('making API call ' + url);

  $.getJSON(url, function (data) {
    console.log('API request sent. Input ' + data.input + ' value = ' + data.value);
    $('#input_' + data.input).html(data.value);
  });
}


// EOF

