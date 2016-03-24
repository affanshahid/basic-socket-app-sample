/*globals io, moment*/
$(function() {
    var socket = io();

    var name = getQueryParam('name') || 'Anonymous';
    var room = getQueryParam('room');

    $('h1.room-name').text(room);

    socket.on('connect', function() {
        console.log('Connected to socket.io server');
        socket.emit('join-room', {
            name: name,
            room: room
        });
    });

    socket.on('message', function(message) {
        var formattedTimestamp = moment.utc(message.timestamp).local().format('h:mm a');
        var $messages = $('.messages');

        console.log('New message:');
        console.log(message.text);

        $messages.append('<p><strong>' + message.name + ' ' + formattedTimestamp + '</strong></p>');
        $messages.append('<p>' + message.text + '</p>');
    });

    //Handles submitting of messages
    var $form = $('#message-form');

    $form.submit(function(event) {
        event.preventDefault();
        var $messageField = $form.find('input[name="message"]');

        socket.emit('message', {
            text: $messageField.val()
        });

        $messageField.val('').focus();
    });
});

function getQueryParam(name) {
    var query = window.location.search;
    var vars = query.substring(1).split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0] === name) {
            var data = pair[1].replace(/\+/g, ' ');
            return decodeURIComponent(data);
        }
    }
    return undefined;
}