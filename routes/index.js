var express = require('express');
var router = express.Router();
var journeyModel = require('../models/journey');
var userModel = require('../models/users');

/* GET home page. */
router.get('/', function (req, res, next) {
   res.render('connection', {title: 'Express'});
});

// router.get('/home', async function(req, res, next){
//   if(req.session.user == null){
//     res.redirect('/')
//   } else {

//     res.render('home', {cityList})
//   }
// });

router.get('/add-journey', async function (req, res, next) {
   res.render('homepage');
});

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
   let userTrips = await userModel.findById(id).populate('last_trips');
   res.render('last_trips', {userTrips});
});

/*
 * BDD- Route servant à vider le basket et à le mettre dans le last_trips
 *  Redirige vers les pages home et last_trips
 * DONT WORK
 */
router.get('/checkout-complete', async function (req, res, next) {
   // mettre la page à redirect en req.query.redirect
   let redirect;
   // mettre la l'id du user en session
   let id;
   let userBasket = await userModel.findById(id).populate('basket');
   let userTrips = await userModel.findbyId(id).populate('last_trips');

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

module.exports = router;
