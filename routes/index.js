var express = require('express');
var router = express.Router();
var journeyModel = require('../models/journey')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/add-journey', async function(req, res, next) {
  res.render('homepage');
});

router.post('/display-trips', async function(req, res, next) {
  var filter = {}

  if(req.body.departure !== '')
    filter.departure = req.body.departure;

  if (req.body.arrival !== '')
    filter.arrival = req.body.arrival;

  if (req.body.date !== '')
    filter.date = req.body.date

  var trips = await journeyModel.find(filter);
  res.render('trips', {trips, date: req.body.date})
});

module.exports = router;
