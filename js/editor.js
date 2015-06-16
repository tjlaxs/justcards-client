var app = angular.module('justCardsApp', []);

app.factory('socket', function () {
    var socket = io();
    return socket;
});

app.controller('ChatController', function ($scope, socket) {
    $scope.messages = [];
    $scope.sendMessage = function () {
        socket.emit('send msg', $scope.msg);
        $scope.msg.text = '';
    };
    
    socket.on('get msg', function (data) {
        $scope.messages.push(data);
        $scope.$digest();
    });
});