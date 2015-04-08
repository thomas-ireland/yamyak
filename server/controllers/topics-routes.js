// server/controllers/topics-routes.js

var Topic = require('../models/topic-model');

module.exports = function(app) {

	app.get('/api/topics', function(request, response) {

        Topic.find(function(error, topics) {
        	if (error)
                response.json(error);
            else
			    response.json(topics); 
		});
    });
};
