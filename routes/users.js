var express = require('express');
var router = express.Router();

var userModel = require('../models/users')

router.post('/sign-up', async function(req, res, next) {

  var searchUser = await userModel.findOne({
    email: req.body.emailFromFront
  })
  
  if(!searchUser){
    var newUser = new userModel({
      firstName: req.body.firstNameFromFront,
      lastName: req.body.lastNameFromFront,
      email: req.body.emailFromFront,
      password: req.body.passwordFromFront,
    })
  
    var newUserSave = await newUser.save();
    req.session.user = newUserSave._id;

    res.redirect('/home')
  } else {
    res.redirect('/')
  }

});

router.post('/sign-in', async function(req, res, next) {

  var searchUser = await userModel.findOne({
    email: req.body.emailFromFront,
    password: req.body.passwordFromFront
  })

  if(searchUser !=null) {
    req.session.user = searchUser._id;

    res.redirect('/home')
  } else {
    res.render('connection')
  }
});

router.get('/logout', async function(req, res, next) {
  req.session.user = null;
  res.redirect('/')
})



module.exports = router;
