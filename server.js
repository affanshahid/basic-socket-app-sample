var express = require('express');
var socketio = require('socket.io');
var http = require('http');

var PORT = process.env.PORT || 8000;
var app = express();
var server = http.Server(app);
var io = socketio(server);

app.use(express.static('./public'));

io.on('connection', function() {
    console.log('User connected via socket.io');
});

server.listen(PORT, function() {
    console.log('Server listening on port ' + PORT + '!');
});