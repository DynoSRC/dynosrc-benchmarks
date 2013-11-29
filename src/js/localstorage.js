$(function () {
  function log (msg) {
    // Log to native console if we have one.
    // ...aaaaaand we have to wrap it in a try..catch because IE8 with DOM
    // Storage disabled and in InPrivate mode is having an issue with this.
    try {
      if (console && console.log) {
        console.log(msg);
      }
    } catch (e) {}

    // Also log to HTML.
    $log.append('<li>' + msg + '</li>');
  }

  function toFixed (number, precision) {
    var multiplier = Math.pow(10, precision);
    return Math.round(number * multiplier) / multiplier;
  }

  function isQuotaError (error) {
    // Chrome and Safari will throw QUOTA_EXCEEDED_ERR's.
    // Firefox = "maximum size reached".
    // IE9 does one of the above, not sure which.
    // IE8 = "not enough storage".
    return !!error.match(/quota|maximum size reached|not enough storage/i);
  }

  function testRunner (label, fn, expected) {
    var result = { label: label },
        didPass;

    try {
      result.output = fn();

      didPass = $.isFunction(expected) ?
          expected(result.output) :
          result.output === expected;

      result.type = didPass ? 'pass' : 'fail';
    } catch (error) {
      // Try to get as much info as we can about
      log('An error was thrown while running the following test: ' + label);
      log('error.name: ' + error.name);
      log('error.message: ' + error.message);
      log('error object: ' + error);

      result.output = error.message;
      result.type = 'error';
    }

    return result;
  }

  var tests = [],
      results = [],
      html = '',
      $results = $('.results'),
      $log = $('.log');

  /*** Create Tests ***/

  // Is the browser even exposing localStorage?

  tests.push(function () {
    return testRunner('!!localStorage', function () {
      return !!localStorage;
    }, true);
  });

  tests.push(function () {
    return testRunner('typeof localStorage', function () {
      return typeof localStorage;
    }, 'object');
  });

  tests.push(function () {
    return testRunner('localStorage.toString()', function () {
      var str;

      // IE8 (TODO: test IE7) throws a not supported error for toString(), but
      // everything is cool if you cast it via + ''. O_o
      try {
        str = localStorage.toString();
      } catch (e) {
        str = localStorage + '';
        // debug so I can catch this for IE7 test
        str = e;
      }

      return str;
    }, '[object Storage]');
  });

  tests.push(function () {
    return testRunner('"localStorage" in window', function () {
      return 'localStorage' in window;
    }, true);
  });

  // How does the browser react when we try to use localStorage?

  tests.push(function () {
    return testRunner('localStorage.setItem("foo", "bar")', function () {
      return localStorage.setItem('foo', 'bar');
    }, undefined);
  });

  tests.push(function () {
    return testRunner('localStorage.getItem("foo")', function () {
      return localStorage.getItem('foo');
    }, 'bar');
  });

  tests.push(function () {
    return testRunner('localStorage.removeItem("foo")', function () {
      var item;

      localStorage.removeItem('foo');
      item = localStorage.getItem('foo');

      if (item === null) {
        return '(item removed)';
      }

      return item;
    }, '(item removed)');
  });

  tests.push(function () {
    return testRunner('localStorage.clear()', function () {
      var item;

      localStorage.setItem('foo', 'bar');
      localStorage.clear();
      item = localStorage.getItem('foo');

      if (item === null) {
        return '(cleared)';
      }

      return item;
    }, '(cleared)');
  });

  // What ways does the browser give us to peak at what's in there?

  tests.push(function () {
    return testRunner('localStorage.key(0)', function () {
      localStorage.setItem('foo', 'bar');

      return localStorage.key(0);
    }, 'foo');
  });

  tests.push(function () {
    return testRunner('localStorage.length', function () {
      return localStorage.length;
    }, 1);
  });

  tests.push(function () {
    return testRunner('Iterate as Array', function () {
      var output = '',
          i, key;

      // Don't want the test to fail just because we're in private mode or
      // have storage disabled.
      try { localStorage.setItem('herp', 'derp'); } catch (e) {}

      for (i=0; i<localStorage.length; i++) {
        key = localStorage.key(i);
        output += i + key + localStorage[key];
      }

      return output;
    }, function (output) {
      // Iteration order is not guaranteed, so we have to
      // check for both possibilities.
      if (output === '0foobar1herpderp' || output == '0herpderp1foobar') {
        return true;
      }

      return false;
    });
  });

  tests.push(function () {
    return testRunner('Iterate as Object', function () {
      var output = '',
          key;

      for (key in localStorage) {
        output += key + localStorage[key];
      }

      return output;
    }, function (output) {
      // Iteration order is not guaranteed, so we have to
      // check for both possibilities.
      if (output === 'foobarherpderp' || output == 'herpderpfoobar') {
        return true;
      }

      return false;
    });
  });

  // What is the capacity for localStorage in this browser?

  if (window.location.href.indexOf('?capacity') > -1) {
    tests.push(function () {
      return testRunner('Capacity Test', function () {
        // A 1000 byte string.
        var data = 'YjP8UtmK3MKh8CjaGTONdcSdbkqntyHXlmc85xNeTKc0E4AC6LxQMQyW0VwquF9sY8ogIhBFDEGmmL9g7q57myNtcp6rmvldrmz7sLDSfVgSZEDo5RxBfSQ1oAVBifimCcJc0KKSDDIQlRurR1F52QIQOxIAgcGqoNMKIbydMYN2KFMmcXdah1GNw9C9TSQ999zh0siW4hdlh8bmpk8LFyGZylaZFvWLRrc0rp5jBKspuGLbuMRD5u4xApVcenS4J054NW0GeUJ9aqjotm2B32clsJoCQ4CZzMjyDqn22kunDACGgH4R2ECUfeh2McDgBpIrUCp5RBYsUUZHTv88WTbEZidMDcCygmdIOsQspJ8hfjWmchw0gtxEIL6anktbaPztOQY6629XMxbnBR4en8uWtjxnbuqEJ4wFgcjLAEEQ28FUAispkFvXdDhj27usmM3sE8Qf1In2Ft3jVQhwiIgI13Pi7IuwfMSHimr2zP1f4oFITSQGE0s6UJnZpjsy0XFeevfEYgkbRCsYY6U3VDRp8Drr9P7coWArxBJGyOt50o7LkcQBPiV5g0kLAWyVjs8xRxHK8x15kjglXkwV0AYY0lPSdjm0zdmM8qOUqxUbbBbuEcogft3nQpoIGlHI1GCTvcmLCV62fAotdVEbjQGOuTK9LFxeh4S6ViOTOYheKOvTDYikKjTOhZsEYn0OCISnOlJVfOFjhabO8z9rXtCyVzj1vVYZUiBNbfgQcu1yYltSSqHifT3qcllrpNbXMCOOVNJDwHuHkDtoh3hhxRmA1SFwAmUDlO2UUNXrgQl9TN55Hj1ipb7FYOyWfRMHYIdrLr5i75sGf1bCqe5VglyM1LHpEhnuvbE0v8i5oU0diS5NHpvpz1trrDbXaWFNw1jhulj3dCMgRYkweRwlyydibEEriDuSIJhquQigR3RmZ1iSlIvMY8znhQg0mjJfI89j878fdHIWKuEHKKY6T01ksWDyRK2D4HgHsWx6',
            // Limit to ~100k iterations.
            limit = 100 * 1024 * 1024,
            i = 0,
            capacity = 0,
            sliced, result;

        localStorage.clear();

        // insanitywolf.gif
        while (++i && capacity < limit) {
          try {
            // Slice off the bytes of the key from the value.
            sliced = data.slice(i.toString().length + 1);
            // Store another 1000 bytes.
            localStorage.setItem(i, sliced);
            // Add those 1000 bytes to the capacity count.
            capacity += 1000;
          } catch (e) {
            if (isQuotaError(e.message)) {
              // We've reached capacity, return the result in MB.
              result = toFixed((capacity / 1024 / 1024), 2);
              result = result + ' MB';

              return result;
            }

            // A different error happened. O_o
            return e.message;
          }
        }
      }, function (output) {
        if (!!output.match(/^\d+(\.\d+)?\sMB$/)) {
          return true;
        }

        return false;
      });
    });
  }

  /*** Run Tests ***/

  $.each(tests, function (i, fn) {
    results = results.concat(fn());
  });

  /*** Nuke ***/

  try {
    localStorage.clear();
  } catch (e) {
    log('Unable to clear localStorage!');
  }

  /*** Display Results ***/

  $.each(results, function (i, result) {
    html += '<tr class="result-' + result.type + '">' +
              '<td>' + result.label + '</td>' +
              '<td>' + result.output + '</td>' +
            '</tr>';
  });

  $results.find('.user-agent').text(window.navigator.userAgent);
  $results.find('tbody').html(html);
  $results.show();
});
