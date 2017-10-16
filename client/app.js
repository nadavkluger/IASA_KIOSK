var myApp = angular.module('myApp', ['ngRoute', 'ui.bootstrap'])
.directive('changePass', function() {
    return {
        restrict: 'E',
        replace: 'true',
        templateUrl: 'views/user/change_password.html'
    };
})
.directive('clearHist', function() {
    return {
        restrict: 'E',
        replace: 'true',
        templateUrl: 'views/student/clear_history.html'
    };
})
.config(function($routeProvider, $locationProvider, $httpProvider) {
  var checkLoggedin = function($q, $timeout, $http, $location) {
      var deferred = $q.defer();
      $http.get('/api/loggedin').success(function(user) {
          if (user) {
              deferred.resolve();
          } else {
              deferred.reject();
              $location.url('/');
          }
      });
      return deferred.promise;
  };
  var checkMaster = function($q, $timeout, $http, $location) {
      var deferred = $q.defer();
      $http.get('/api/loggedin').success(function(user) {
          if (user && user.master) {
              deferred.resolve();
          } else {
              deferred.reject();
              $location.url('/');
          }
      });

      return deferred.promise;
  };
  var checkNotLoggedin = function($q, $timeout, $http, $location) {
      var deferred = $q.defer();
      $http.get('/api/loggedin').success(function(res) {
          if (!res) {
              deferred.resolve();
          } else {
              deferred.reject();
              $location.url('/products');
          }
      });

      return deferred.promise;
  };
  $routeProvider
  .when('/login', {
      controller: 'LoginController',
      templateUrl: 'views/login.html',
      resolve: {
          loggedin: checkNotLoggedin
      }
  })
  .when('/products', {
      controller: 'ProductsController',
      templateUrl: 'views/product/products.html',
      resolve: {
          loggedin: checkLoggedin
      }
  })
  .when('/products/manage', {
    controller: 'ProductsController',
    templateUrl: 'views/product/manage_products.html',
    resolve: {
        loggedin: checkLoggedin
    }
  })
  .when('/users/manage', {
    controller: 'UsersController',
    templateUrl: 'views/user/manage_users.html',
    resolve: {
        master: checkMaster
    }
  })
  .when('/products/buy/:id', {
    controller: 'ProductsController',
    templateUrl: 'views/product/transaction_panel.html',
    resolve: {
        loggedin: checkLoggedin
    }
  })
  .when('/products/add', {
    controller: 'ProductsController',
    templateUrl: 'views/product/add_product.html',
    resolve: {
        loggedin: checkLoggedin
    }
  })
  .when('/products/edit/:id', {
    controller: 'ProductsController',
    templateUrl: 'views/product/edit_product.html',
    resolve: {
        loggedin: checkLoggedin
    }
  })
  .when('/students/edit/:id', {
    controller: 'StudentsController',
    templateUrl: 'views/student/edit_student.html',
    resolve: {
        loggedin: checkLoggedin
    }
  })
  .when('/students/manage', {
    controller: 'StudentsController',
    templateUrl: 'views/student/manage_students.html',
    resolve: {
        loggedin: checkLoggedin
    }
  })
  .otherwise({
    redirectTo: '/login'
  });
})
.factory('data',[
]);
