$(function () {
  window.__DOMREADY = Date.now(); // domready fallback.
});

$(window).load(function () {
  window.__ONLOAD = Date.now(); // onload fallback.

  // Have to run on the next event loop in order to get the loadEventEnd time.
  setTimeout(function () {
    var $results = $('.results'),
        supportsNavTiming = !!(window.performance && window.performance.timing),
        timings = supportsNavTiming ? window.performance.timing : {},
        events = ['responseStart', 'responseEnd', 'domLoading',
                  'domContentLoadedEventEnd', 'loadEventStart', 'loadEventEnd'],
        html = '',
        firstbyte;

    if (!supportsNavTiming) {
      $results.find('h2').text('Loading Events');

      timings.responseStart = window.__FIRSTBYTE;
      // NOT domContentLoadedEventEnd.
      timings.domContentLoadedEventStart = window.__DOMREADY;
      // NOT loadEventEnd.
      timings.loadEventStart = window.__ONLOAD;

      events = ['responseStart', 'domContentLoadedEventStart',
                'loadEventStart'];
    }

    firstbyte = timings.responseStart;

    $.each(events, function (i, event) {
      if (!timings[event]) { return; }

      var delta = timings[event] - firstbyte;

      html += '<tr><td>' + event + '</td><td>' + delta + '</td></tr>';
    });

    $results.find('tbody').html(html);
    $results.show();
  }, 1);
});
