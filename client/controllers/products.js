var myApp = angular.module('myApp');

myApp.controller('ProductsController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams) {
    console.log('ProductsController loaded...');
    $('#reversedRange').on('keypup', function() {
  $(".dropdown-menu").css({ "left": "auto", "right": "10px" });
});
    $scope.data = {};
    $scope.data.quantity=1;
    $scope.getProducts = function() {
        $http.get('/api/products').success(function(response) {
            $scope.products = response;
        });
    }
    $scope.getProduct = function() {
        var id = $routeParams.id;
        $http.get('/api/products/' + id).success(function(response) {
            $scope.product = response;
        });
    }
    $scope.addProduct = function() {
        $http.post('/api/add/product', $scope.product).success(function(response) {
            window.location.href = '#/products/manage';
        });
    }
    $scope.makeTransaction = function() {
        var transaction={
          studentID:$scope.data.selectedStudent._id,
          product:$scope.product,
          quantity:$scope.data.quantity,
          timeStamp: new Date().toString()
        }
        $http.post('/api/transaction/', transaction).success(function(response) {
            window.location.href = '#/products';
        });
    }
    $scope.buyInCash = function(product) {
        product.stock -= 1;
        $http.put('/api/products/' + product._id, product).success(function(response) {
            window.location.href = '#/products';
        });
    }
    $scope.updateProduct = function() {
        var id = $routeParams.id;
        $http.put('/api/products/' + id, $scope.product).success(function(response) {
            window.location.href = '#/products';
        });
    }

    $scope.removeProduct = function(id) {
        $http.delete('/api/products/' + id).success(function(response) {
            window.location.href = '#/products/manage';
        });
    }
}]);
