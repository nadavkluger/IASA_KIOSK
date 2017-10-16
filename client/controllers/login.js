
var myApp = angular.module('myApp');

myApp.controller('LoginController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){
	console.log('LoginController loaded...');

	$scope.submit=function(){
    var data={
      username:$scope.user,
      password:CryptoJS.SHA1($scope.pass).toString()
    }
    // console.log(this.data);
    $http.post('/api/login', data).success(function(response){
      if(response=='OK'){
        $location.path('/products')
      }
      else{
        alert(response);
      }
    });
  }
}]);
