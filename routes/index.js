var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');

var journeyModel = require('../models/journey')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/add-journey', async function(req, res, next) {

  var departure = req.body.departure;
  var arrival = req.body.arrival;
  var date = new Date(req.body.date);

  console.log(departure)
  console.log(arrival)
  console.log(date)
  
  res.render('homepage', { title: 'Express' });
});


module.exports = router;
