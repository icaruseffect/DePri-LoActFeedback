angular.module('myApp', ['ngResource'])
  .factory('JsonService', function ($resource) {
    return $resource('data.json');
  });
