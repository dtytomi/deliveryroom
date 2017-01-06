var express = require('express'),
  router = express.Router();


module.exports.index =  function (req, res) {

  res.render('index', {
    title: 'Generator-Express MVC'
  });
};