var app = angular.module('justCardsApp', ['ui.layout']);

app.factory('socket', function () {
    var socket = io();
    return socket;
});

app.controller('ChatController', function ($scope, socket) {
    $scope.chat = {};
    $scope.chat.nickname = "guest-" + socket.id;
    $scope.chat.identified = false;
    $scope.chat.messages = [];
    
    $scope.sendMessage = function () {
        $scope.msg.sender = $scope.chat.nickname;
        socket.emit('send msg', $scope.msg);
        $scope.msg.text = '';
    };
    
    $scope.sendIdentity = function() {
        if ($scope.chat.nickname != null) {
            // TODO: send to server
            $scope.chat.identified = true;
        }
    };
    
    socket.on('get msg', function (data) {
        $scope.chat.messages.push(data);
        $scope.$digest();
    });
});