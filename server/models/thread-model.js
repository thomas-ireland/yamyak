// server/models/thread-model.js

var mongoose = require('mongoose');

var Like = new mongoose.Schema({

  author: String,
  posted: { type: Date, default: Date.now },
});

var Comment = new mongoose.Schema({

  topic: String,
  content: String,
  author: String,
  authorPhoto: String,
  likes: [ Like ],
  posted: { type: Date, default: Date.now }
});

var Thread = new mongoose.Schema({
  
  title: String,
  topic: String,
  content: String,
  author: String,
  authorPhoto: String,
  likes: [ Like ],
  comments: [ Comment ],
  posted: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Thread', Thread); 
     	
                                                                     																																		