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


router.post('/display-trips', async function (req, res, next) {
   var filter = {};

   if (req.body.departure !== '')
      filter.departure = req.body.departure;

   if (req.body.arrival !== '')
      filter.arrival = req.body.arrival;

   if (req.body.date !== '')
      filter.date = req.body.date;

   var trips = await journeyModel.find(filter);
   res.render('trips', {trips, date: req.body.date});
});

/* Affiche les derniers voyages effectués - DONT WORK*/
router.get('/last-trips', async function (req, res, next) {
   // mettre la l'id du user en session
   let id;
   let userTrips = await userModel.findById(id).populate('last_trips').exec();
   res.render('last_trips', {userTrips});
});

/*
 * BDD- Route servant à vider le basket et à le mettre dans le last_trips
 *  Redirige vers les pages home et last_trips
 * DONT WORK
 */
router.get('/checkout-complete', async function (req, res, next) {
   // mettre la page à redirect en req.query.redirect
   let redirect = req.query.redirect;
   // mettre la l'id du user en session
   let id;
   let userBasket = await userModel.findById(id).populate('basket').exec();
   let userTrips = await userModel.findbyId(id).populate('last_trips').exec();

   for (let i = 0; i < userBasket.basket.length; i++) {
      userTrips.basket.push(userBasket.basket[i]._id);
   }
   userBasket.basket.splice(userBasket.basket.length);

   if (redirect === 'home')
      res.redirect('/search-journey')
    else if (redirect === 'last-trips')
      res.redirect('/last-trips');
    else
      res.redirect('/search-journey')
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