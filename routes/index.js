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
   let userTrips = await userModel.findById(req.session.user).populate('last_trips').exec();
   res.render('last_trips', {userTrips});
});

/*
 * BDD- Route servant à vider le basket et à le mettre dans le last_trips
 *  Redirige vers les pages home et last_trips
 */
router.get('/checkout-complete', async function (req, res, next) {
   let redirect = req.query.redirect;
   let userBasket = await userModel.findById(req.session.user).populate('basket');

   let userTrips = await userModel.findById(req.session.user).populate('last_trips');

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

   var basket = await userModel.findById(req.session.user)
      .populate('basket')
      .exec();

   var item = await journeyModel.findById(req.query.id);
   console.log(item);
   basket.basket.push(item._id);

   await basket.save();

   var basket = await userModel.findById(req.session.user)
      .populate('basket')
      .exec();
   console.log(basket);

   res.render('checkout', {basket});
});


// Route qui sert à supprimer des éléments de son panier
router.get('/delete-trip', async function (req, res, next) {

var userBasket = await userModel.findById(req.session.user).populate('basket').exec();

newBasket = userBasket.basket.splice(req.query.position, 1)

await userBasket.save();

var basket = await userModel.findById(req.session.user).populate('basket').exec();

  res.render('checkout', { basket })
})

module.exports = router;