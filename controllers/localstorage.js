var results = require('../localstorage.json');

function getBrowserIcon (browser) {
  switch (browser) {
    case 'Chrome':
      return '<i class="fontelico-chrome"></i>';
    case 'Firefox':
      return '<i class="fontelico-firefox"></i>';
    case 'IE':
      return '<i class="fontelico-ie"></i>';
    case 'Opera':
      return '<i class="fontelico-opera"></i>';
    case 'Safari':
      return '<i class="fa fa-compass"></i>';
    default:
      return browser;
  }
}

function getPlatformIcon (platform) {
  switch (platform) {
    case 'OS X':
      return '<i class="fa fa-apple"></i>';
    case 'Windows':
      return '<i class="fa fa-windows"></i>';
    default:
      return platform;
  }
}

function transformResult (result) {
  // Use capacity as a proxy for "success" class.
  result.class_name = result.capacity == 'N/A' ? '' : 'success';

  result.browser = getBrowserIcon(result.browser);
  result.platform = getPlatformIcon(result.platform);

  return result;
}

module.exports = function (req, res) {
  res.render('localstorage', {
    results: results.map(transformResult)
  });
};
