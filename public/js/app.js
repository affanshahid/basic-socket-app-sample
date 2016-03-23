/*globals io*/
$(function() {
    var socket = io();

    socket.on('connect', function() {
        console.log('Connected to socket.io server');
    });

    socket.on('message', function(message) {
        console.log('New message:');
        console.log(message.text);
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
