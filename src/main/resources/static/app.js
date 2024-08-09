let stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    } else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    const socket = new SockJS('https://a093-188-161-93-52.ngrok-free.app/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/greetings', function (greeting) {
            console.log('Received message: ' + greeting.body);

            try {
                let parsedMessage;
                if (typeof greeting.body === 'string') {
                    parsedMessage = JSON.parse(greeting.body);
                } else {
                    parsedMessage = greeting.body;
                }

                if (parsedMessage.message) {
                    showGreeting(parsedMessage.message);
                } else {
                    console.error('Unexpected message format:', parsedMessage);
                }
            } catch (error) {
                console.error('Error parsing greeting message:', error);
            }
        });
    }, function (error) {
        console.error('STOMP error:', error);
    });
}

function showGreeting(message) {
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
        console.log("Disconnected");
        setConnected(false);
    }
}

function sendMessage() {
    const message = $("#message").val();
    console.log('Sending message:', message);
    if (message) {
        try {
            stompClient.send("/app/message", {}, JSON.stringify({'name': message}));
            console.log('Message sent successfully');
        } catch (error) {
            console.error('Error sending message:', error);
        }
        $("#message").val("");
    } else {
        console.log('Message is empty');
    }
}


$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $("#connect").click(function() { connect(); });
    $("#disconnect").click(function() { disconnect(); });
    $("#sendMessage").click(function() { sendMessage(); });
});
