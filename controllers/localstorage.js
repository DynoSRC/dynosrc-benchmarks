var results = require('../localstorage.json');

module.exports = function (req, res) {
  res.render('localstorage', {
    results: results
  });
};
