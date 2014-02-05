window.util = {};

// MDN cookie lib.
window.util.cookie = {
  getItem: function (sKey) {
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!sKey || !this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( sDomain ? "; domain=" + sDomain : "") + ( sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  }
};

function getResultData () {
  var cookie = JSON.parse(util.cookie.getItem('timings')) || {};

  // If this is the same cacheId we've been using, return the results.
  if (window.__CACHEID === cookie.cacheId) {
    return cookie.results;
  }

  // Otherwise this is a new test so return a new array.
  return [];
}

function getDeltas (events, timings) {
  return $.map(events, function (event) {
    if (!timings[event]) { return; }

    var delta = timings[event] - timings.responseStart;

    return { event: event, delta: delta };
  });
}

function saveResults (results) {
  var cookie = {
        cacheId: window.__CACHEID,
        results: results
      };

  util.cookie.setItem('timings', JSON.stringify(cookie));
}

$(function () {
  window.__DOMREADY = Date.now(); // domready fallback.
});

$(window).load(function () {
  window.__ONLOAD = Date.now(); // onload fallback.

  // Have to run on the next event loop in order to get the loadEventEnd time.
  setTimeout(function () {
    var $resultsDiv = $('.results'),
        supportsNavTiming = !!(window.performance && window.performance.timing),
        timings = supportsNavTiming ? window.performance.timing : {},
        events = ['responseStart', 'responseEnd', 'domLoading',
                  'domContentLoadedEventEnd', 'loadEventStart', 'loadEventEnd'],
        results = getResultData(),
        headHtml = '',
        bodyHtml = '',
        firstbyte, table;

    if (!supportsNavTiming) {
      $resultsDiv.find('h2').text('Loading Events');

      timings.responseStart = window.__FIRSTBYTE;
      // NOT domContentLoadedEventEnd.
      timings.domContentLoadedEventStart = window.__DOMREADY;
      // NOT loadEventEnd.
      timings.loadEventStart = window.__ONLOAD;

      events = ['responseStart', 'domContentLoadedEventStart',
                'loadEventStart'];
    }

    results.push(getDeltas(events, timings));
    saveResults(results);

    // Construct header row.
    $.each(events, function (i, event) {
      headHtml += '<th>' + event + '</th>';
    });

    // Construct body row for each result set.
    $.each(results, function (i, resultSet) {
      var run = i + 1;

      bodyHtml += '<tr><td>' + run + '</td>';

      // Grab delta for each event.
      $.each(resultSet, function (j, event) {
        bodyHtml += '<td>' + event.delta + '</td>';
      });

      bodyHtml += '</tr>';
    });

    table = $('\
      <table class="table table-bordered table-hover">\
        <thead><tr><th>Run</th>' + headHtml + '</tr></thead>\
        <tbody>' + bodyHtml + '</tbody>\
      </table>\
    ');

    $resultsDiv.append(table).show();
  }, 1);
});
