var express = require('express');
var http = require('http');

var PORT = process.env.PORT || 8000;
var app = express();
var server = http.Server(app);

app.use(express.static('./public'));

server.listen(PORT, function() {
    console.log('Server listening on port ' + PORT + '!');
});