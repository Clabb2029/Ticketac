var express = require('express');
var router = express.Router();
var journeyModel = require('../models/journey')
var userModel = require('../models/users')



/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('connection');
});

// Page de connexion

router.get('/home', async function(req, res, next){
  if(req.session.user == null){
    res.redirect('/')
  } else {
    res.render('homepage')
  }
});

// Recherche d'un itinéraire

router.get('/search-journey', async function(req, res, next) {
  res.render('homepage');
});

// Affichage des itinéraires avec prix 

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

// Page de checkout - Validation du panier

router.get('/checkout', async function(req, res, next) {

  // Change FindById when session
  var basket = await userModel.findById('61f2abbeea245b5a9c023356')
                              .populate('basket')
                              .exec()
  
var item = await journeyModel.findById(req.query.id) 
console.log(item) 
basket.basket.push(item._id)

await basket.save();

var basket = await userModel.findById('61f2abbeea245b5a9c023356')
.populate('basket')
.exec()
console.log(basket)

  res.render('checkout', {basket});
});

module.exports = router;