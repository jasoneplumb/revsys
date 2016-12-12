// File: client.js
// The client-side portion of the PiLED web app.
// This file is one of three: server.js, client.js and index.html.

window.onload = function () {
  var url, inputID = ['LED_status']; // The inputs used

  // Display some initial (place holder) text
  $('#input_' + inputID[0]).html('Loading...');

  // Every half second, display the LED status
  setInterval( function () {
    url = document.URL + 'inputs/' + inputID[0];
    console.log('making API call ' + url);

    $.getJSON(url, function (data) {
      console.log('API response received. Input ' + data.input + ' value = ' + data.value);
      $('#input_' + data.input).html(data.value);
    });
  }, 500);
};

// Change the state (on, off) of the LED when called
function toggleLED() {
  var requestID = ['LED_toggle']; // The requests

  url = document.URL + 'inputs/' + requestID[0];
  console.log('making API call ' + url);

  $.getJSON(url, function (data) {
    console.log('API request sent. Input ' + data.input + ' value = ' + data.value);
    $('#input_' + data.input).html(data.value);
  });
}

//EOF

