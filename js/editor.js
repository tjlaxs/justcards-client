var app = angular.module('justCardsApp', ['ui.layout', 'ngFileUpload']);

app.factory('socket', function () {
    var socket = io();
    return socket;
});

app.controller('FileUploadController', ['$scope', 'Upload', function ($scope, Upload) {
    $scope.$watch('files', function () {
        $scope.upload($scope.files);
    });
    
    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: '/upload/',
                    fields: {'username': $scope.username},
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                });
            }
        }
    };
}]);

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