var myApp = angular.module('myApp');

myApp.controller('IndexController', ['$scope', '$http', '$location', '$routeParams',
    function($scope, $http, $location, $routeParams) {
        console.log('IndexController loaded...');
        $scope.userData = {
            loggedin: false,
            master: false,
            username: ''
        };
        $scope.userPassForm = {
            oldPass: '',
            newPass: '',
            newPassAgain: '',
            id: '',
            validForm: false
        };
        $scope.submitForm = function(isValid) {
            if ($scope.userPassForm.newPass != $scope.userPassForm.newPassAgain) {
                passForm.$error.validationError = true;
                return;
            }
            if (isValid) {
              var data ={
                oldPass:CryptoJS.SHA1($scope.userPassForm.oldPass).toString(),
                newPass:CryptoJS.SHA1($scope.userPassForm.newPass).toString(),
                id:$scope.userPassForm.id
              }
                $http.post('/api/password',data).success(function (response){
                  if(response=='OK'){
                    $('#myModal').modal('hide');
                    toastr.success('Password changed')
                  }
                });
            }
        }

        $scope.update = function() {
            $http.get('/api/loggedin').then(function(response) {
                if (response.data) {
                    $scope.userData.loggedin = true;
                    $scope.userData.master = response.data.master;
                    $scope.userData.username = response.data.username;
                    $scope.userPassForm.id = response.data.id;
                }
                else{
                  $scope.userData.loggedin=false;
                  $scope.userData.master=false;
                  $scope.userData.username='';
                }
            })
        }

        $scope.logout = function() {
            $http.post('/api/logout').then(function(response) {
                if (response.data) {
                    $scope.userData.loggedin = false;
                    $scope.userData.master = false;
                    window.location.href = '#/';
                }
            });
        }

    }
]);
