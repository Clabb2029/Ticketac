var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    basket: [{type: mongoose.Schema.Types.ObjectId, ref: 'journeys'}],
    last_trips: [{type: mongoose.Schema.Types.ObjectId, ref: 'journeys'}]
  });
  
var userModel = mongoose.model('users', userSchema);

module.exports = userModel;