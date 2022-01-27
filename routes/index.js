var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');

var journeyModel = require('../models/journey')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('connection', { title: 'Express' });
});

// router.get('/home', async function(req, res, next){
//   if(req.session.user == null){
//     res.redirect('/')
//   } else {
   

//     res.render('home', {cityList})
//   }
// });

module.exports = router;
