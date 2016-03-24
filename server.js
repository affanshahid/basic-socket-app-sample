var express = require('express');
var socketio = require('socket.io');
var http = require('http');
var moment = require('moment');

var PORT = process.env.PORT || 8000;
var app = express();
var server = http.Server(app);
var io = socketio(server);

app.use(express.static('./public'));

io.on('connection', function(socket) {
    console.log('User connected via socket.io');
    
    var clientInfo;

    socket.on('join-room', function(request) {
        clientInfo = request;

        socket.join(clientInfo.room);
        socket.broadcast.to(clientInfo.room).emit('message', {
            name: 'System',
            text: clientInfo.name + ' has joined!',
            timestamp: moment().valueOf()
        });
    });

    socket.on('message', function(message) {
        console.log('Message recieved: ' + message.text);
        message.timestamp = moment.now().valueOf();
        message.name = clientInfo.name;
        io.to(clientInfo.room).emit('message', message);
    });

    socket.emit('message', {
        text: 'Welcome to the chat app!',
        timestamp: moment().valueOf(),
        name: 'System'
    });
});

server.listen(PORT, function() {
    console.log('Server listening on port ' + PORT + '!');
});