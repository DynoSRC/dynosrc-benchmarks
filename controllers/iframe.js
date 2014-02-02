var images = [
      'http://i.imgur.com/htZ22JU.png',
      'http://i.imgur.com/pzHRqhn.jpg',
      'http://i.imgur.com/jLot7.jpg',
      'http://i.imgur.com/y1n5d.jpg',
      'http://i.imgur.com/s89Bo.jpg'
    ];

module.exports = function (req, res) {
  var imageSrc = images[req.params.index],
      cacheId = req.query.cacheId;

  res.render('iframe', {
    imageSrc: imageSrc,
    cacheId: cacheId
  });
};
