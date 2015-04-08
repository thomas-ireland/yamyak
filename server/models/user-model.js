// server/models/user-model.js

var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
    
  username: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  photo: String,
  joined: { type: Date, default: Date.now },
  posts:[{id: String, added: { type: Date, default: Date.now }}],

});
