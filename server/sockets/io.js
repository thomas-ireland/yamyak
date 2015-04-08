// server/sockets/io.js

module.exports = function(io) {
    
    io.on('connection', function(socket){
        
        console.log('a user connected');
        
        io.on('comment:add', function(comment){
        
            io.broadcast.emit('comment:add', comment);
        });
        
        io.on('thread:add', function(thread){
        
            io.broadcast.emit('thread:add', thread);
        });

        socket.on('threads:loading', function(loadingStatus){
         
            io.emit('threads:loading', loadingStatus);
       
        });
      
        socket.on('thread:like', function(like){
         
            socket.broadcast.emit('thread:like', like);
       
        });
        
        socket.on('comment:like', function(like){
        
            socket.broadcast.emit('comment:like', like);
       
        });
    });
};