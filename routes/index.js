var express = require('express');
var router = express.Router();
var journeyModel = require('../models/journey');
var userModel = require('../models/users');

function capitalizeFirstLetter(string) {
   return string.charAt(0).toUpperCase() + string.slice(1);
}

/* GET home page. */
router.get('/', function (req, res, next) {
   res.render('connection');
});

// Page de connexion
router.get('/home', async function (req, res, next) {
   if (req.session.user == null) {
      res.redirect('/');
   } else {
      res.render('homepage');
   }
});

// Recherche d'un itinéraire
router.post('/display-trips', async function (req, res, next) {
   var filter = {};

   if (req.body.departure !== '')
      filter.departure = capitalizeFirstLetter(req.body.departure.toString().toLowerCase());

   if (req.body.arrival !== '')
      filter.arrival = capitalizeFirstLetter(req.body.arrival.toString().toLowerCase());

   if (req.body.date !== '')
      filter.date = req.body.date;

   var trips = await journeyModel.find(filter);
   res.render('trips', {trips, date: req.body.date});
});

/* Affiche les derniers voyages effectués - DONT WORK*/
router.get('/last-trips', async function (req, res, next) {
   // mettre la l'id du user en session
   let id;
   let userTrips = await userModel.findById('61f2ac5aea245b5a9c02335f').populate('last_trips').exec();
   console.log(userTrips);
   res.render('last_trips', {userTrips});
});

/*
 * BDD- Route servant à vider le basket et à le mettre dans le last_trips
 *  Redirige vers les pages home et last_trips
 * DONT WORK
 */
router.get('/checkout-complete', async function (req, res, next) {
   let redirect = req.query.redirect;
   let id;
   let userBasket = await userModel.findById('61f2ac5aea245b5a9c02335f').populate('basket');

   let userTrips = await userModel.findById('61f2ac5aea245b5a9c02335f').populate('last_trips');

   console.log(userBasket);


   for (let i = 0; i < userBasket.basket.length; i++) {
      await userTrips.last_trips.push(userBasket.basket[i]._id);
   }
   userBasket.basket.splice(userBasket.length);
   await userBasket.save();
   await userTrips.save();

   if (redirect === 'home')
      res.redirect('/home');
   else if (redirect === 'last-trips')
      res.redirect('/last-trips');
   else {
      res.redirect('/home');
   }
});

// Page de checkout - Validation du panier
router.get('/checkout', async function (req, res, next) {

   // Change FindById when session
   var basket = await userModel.findById('61f2ac5aea245b5a9c02335f')
      .populate('basket')
      .exec();

   var item = await journeyModel.findById(req.query.id);
   console.log(item);
   basket.basket.push(item._id);

   await basket.save();

   var basket = await userModel.findById('61f2ac5aea245b5a9c02335f')
      .populate('basket')
      .exec();
   console.log(basket);

   res.render('checkout', {basket});
});

module.exports = router;