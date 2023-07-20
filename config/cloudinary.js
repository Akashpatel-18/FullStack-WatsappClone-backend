const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dec5cr36i',
  api_key: 991636334557315,
  api_secret: 'hMsZDkNxfgzm37QXlWQL0bh5rww',
});

module.exports = { cloudinary };