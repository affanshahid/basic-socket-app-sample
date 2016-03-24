var express = require('express');
var socketio = require('socket.io');
var http = require('http');
var moment = require('moment');

var PORT = process.env.PORT || 8000;
var app = express();
var server = http.Server(app);
var io = socketio(server);

app.use(express.static('./public'));

var clientInfo = {};

io.on('connection', function(socket) {
    console.log('User connected via socket.io');

    socket.on('disconnect', function() {
        if (clientInfo[socket.id] !== 'undefined') {
            socket.leave(clientInfo[socket.id].room);
            io.to(clientInfo[socket.id].room).emit('message', {
                text: clientInfo[socket.id].name + ' has left the room',
                name: 'System',
                timestamp: moment().valueOf()
            });

            delete clientInfo[socket.id];
        }
    });

    socket.on('join-room', function(request) {
        clientInfo[socket.id] = request;

        socket.join(request.room);
        socket.broadcast.to(request.room).emit('message', {
            name: 'System',
            text: request.name + ' has joined!',
            timestamp: moment().valueOf()
        });
    });

    socket.on('message', function(message) {
        console.log('Message recieved: ' + message.text);
        message.timestamp = moment.now().valueOf();
        message.name = clientInfo[socket.id].name;
        io.to(clientInfo[socket.id].room).emit('message', message);
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