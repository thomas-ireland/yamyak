// server/models/topic-model.js

var mongoose = require('mongoose');

module.exports = mongoose.model('Topic', {
    
  title: String,    
});