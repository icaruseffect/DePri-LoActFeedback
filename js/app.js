// Application Module
var app = angular.module('myApp', ['jsonService']);

//Main Controller
app.controller('MainCtrl', function ($scope, JsonService) {

  // Use the JsonService in services.js to move data from json to scope
  JsonService.get(function (data) {
    $scope.name = data.name;
    $scope.children = data.children;
  });

});
