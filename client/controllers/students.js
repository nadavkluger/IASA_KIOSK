var myApp = angular.module('myApp');

myApp.controller('StudentsController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams) {
    console.log('StudentsController loaded...');

    var JSON2CSV = function(jsonArray){
      const replacer = (key, value) => value === null ? '' : value ;// specify how you want to handle null values here
      var header = Object.keys(jsonArray[0]);
      var transHeader = Object.keys(jsonArray[jsonArray.length-1][header[5]][0]);
      header.shift();
      header.pop();
      transHeader.pop();
      header = header.concat(transHeader);
      var csv = jsonArray.map(row => header.map(fieldName =>
        JSON.stringify(row[fieldName]||row['transactions'].map
        (obj=>obj[fieldName]).join(','), replacer)).join(',')).join('\r\n');
      csv =header.join(',')+'\r\n'+csv;
      return csv;
    }
    $scope.getStudent = function() {
        var id = $routeParams.id;
        $http.get('/api/students/' + id).success(function(response) {
            $scope.student = response;
        });
    }
    $scope.getStudents = function() {
        $http.get('/api/students').success(function(response) {
            $scope.students = response;
        });
    }
    $scope.download = function(){
      var d = new Date().toDateString().split(' ');
      d.splice(0,1);
      d=d.join('-');

      var elem = window.document.createElement('a');
      // var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify($scope.students));
      // elem.setAttribute("href",dataStr);
      // elem.setAttribute("download", "students.json");
      // elem.click();
      // return;
      elem.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent('\ufeff'+JSON2CSV($scope.students));
      elem.target = '_blank';
      elem.download = d+'.csv';
      document.body.appendChild(elem);
      elem.click();
      document.body.removeChild(elem);
    }
    $scope.updateStudent = function() {
        var id = $routeParams.id;
        $http.put('/api/students/' + id, $scope.student).success(function(response) {
            window.location.href = '#/students/manage';
        });
    }
    $scope.clearTransactions = function(){
      var id = $routeParams.id;
      $http.get('/api/clear/transactions/' + id).success(function(response) {
            window.location.href = '#/students/edit/'+id;
            window.location.reload();
      });
    }
}]);
