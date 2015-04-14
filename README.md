YamYak

For a live demo see:  https://yamyak.herokuapp.com
 
This project was developed as part of my MSc Computer Science dissertation at the University of Kent. 

The discussion forum was an integral part of the early web's social space. But in 2015 it has become dated and seemingly irrelevant. Forum software providers have not kept apace with the developments that have greatly enhanced the user experience online today, such as Ajax to create a complete single page applications and Web Sockets for real-time updates.

It is one of the only areas of the internet that looks the same today as it did in the 90s. In spite of this, however, these communities continue to exist, which is, I argue, actually testimony to its continued relevance. This project is a complete architectural and UI redesign of the forum that incorporates these technologies to bring this new experience to forum users today. 

I have used a food discussion forum called YamYak as an example of it being used. However, it is agnostic about the discussion topic and it can be embedded into an existing site rather than a dedicated site.

THE STACK:

HTML5
ResponsiveCSS3
AngularJS
Socket.io
Node.js 
Express 
MongoDB / Mongoose

You can visit a running example of the application here:

 https://yamyak.herokuapp.com

If you have Node installed, you can clone the repository, install the dependencies from npm, and run it locally with the prompt: 

$ node server

Note: I have removed my MongoDB credentials