const app = require("express")();
var fs = require('fs')
const httpsServer = require("https").createServer({
    key: fs.readFileSync('../ssl/server.key'),
    cert: fs.readFileSync('../ssl/mydomain.crt')
},app);
const options =  {
    cors: {
      origin: '*',
    }
  };
const io = require("socket.io")(httpsServer, options);

io.on("connection", socket => {
    socket.on('uuid',function(data){
        console.log(data,"uuid");
        socket.room = data;
        socket.join(data);
        console.log(socket.room,'room');
    })

    socket.on('switchRoom', function(change,newroom){
		// leave the current room (stored in session)
    console.log('left',change)
		socket.leave(change);
		// join new room, received as function parameter
    socket.room = newroom;
		socket.join(newroom);
		// socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
		// sent message to OLD room
		// socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
		// update socket session room title
		// socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
		// socket.emit('updaterooms', rooms, newroom);
	});

    socket.on('sendchat', function (room,data,name,type) {
		// we tell the client to execute 'updatechat' with 2 parameters
        console.log(data,name,"sendchat");
        socket.room = room;
        console.log(socket.room,"sendchat");
		    io.sockets.in(socket.room).emit('updatechat', data,name,type);
	  });
    socket.on('seen',function(room,name){
      socket.room = room;
      console.log(socket.room,"seen");
      io.sockets.in(socket.room).emit('updateSeen', name);
    }
    );
  
});



httpsServer.listen(5000,()=>[
    console.log('listening on 5000')
]);