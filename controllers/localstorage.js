var results = require('../localstorage.json'),

    resultFields = [
      'private',
      'storage_disabled',
      'double_not',
      'typeof',
      'tostring',
      'in_window',
      'setitem',
      'getitem',
      'removeitem',
      'clear',
      'key',
      'length',
      'as_array',
      'as_object'
    ];

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

function getResultIcon (result) {
  switch (result) {
    case 'DANGER':
      return '<i class="fa fa-ban danger"></i>';
    case 'ERROR':
      return '<i class="fa fa-exclamation-triangle"></i>';
    case 'FAIL':
      return '<i class="fa fa-exclamation-circle"></i>';
    case 'PASS':
      return '<i class="fa fa-check-circle"></i>';
    case 'SAFE':
      return '<i class="fa fa-eye muted"></i>';
    default:
      return result;
  }
}

function transformResult (result) {
  // Use capacity as a proxy for "success" class.
  result.class_name = result.capacity == 'N/A' ? '' : 'success';

  result.browser = getBrowserIcon(result.browser);
  result.platform = getPlatformIcon(result.platform);

  resultFields.forEach(function (field) {
    result[field] = getResultIcon(result[field]);
  });

  return result;
}

module.exports = function (req, res) {
  res.render('localstorage', {
    results: results.map(transformResult)
  });
};
