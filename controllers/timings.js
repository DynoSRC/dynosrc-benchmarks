module.exports = function (req, res) {
  var type = req.params.type,
      template = 'timings/' + type,
      timestamp = Date.now(),
      cacheId = type + '-' + timestamp;

  res.render(template, {
    timestamp: timestamp,
    cacheId: cacheId
  });
};
