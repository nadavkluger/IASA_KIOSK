var myApp = angular.module('myApp');

myApp.controller('UsersController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams) {
    console.log('UsersController loaded...');
    $scope.data = {};
    $scope.getUsers = function() {
        $http.get('/api/users').success(function(response) {
            $scope.users = response;
        });
    }

    $scope.addUser = function() {
        $http.post('/api/add/user', {
            username: $scope.data.username
        }).success(function(response) {
            window.location.href = '#/users/manage';
            window.location.reload();
        });
    }

    $scope.removeUser = function(id) {
        $http.delete('/api/users/' + id).success(function(response) {
            window.location.href = '#/users/manage';
            window.location.reload();
        });
    }
    $scope.resetUser = function(id) {
        $http.post('/api/users/reset/' + id).success(function(response) {
            window.location.href = '#/users/manage';
        });
    }
}]);
