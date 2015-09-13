/*
  Services
*/

// Data Service holt die Daten aus der json in js/ und gibt diese an den Aufrufe zurück
// Definiere ( App-Name, [ Abhängigkeiten])
var dataService = angular.module('dataService', ['ngResource']);

dataService.factory('dataService', function ($resource) {
  return $resource('js/data.json', {}, {
    getData: {
      method: 'GET',
      isArray: false
    }
  });
});

var webdataService = angular.module('webdataService', ['ngResource']);

webdataService.factory('webdataService', function ($resource) {
  return $resource('http://176.198.133.123\\:8080/WebServiceClient/sampleHomeBereichProxy/Result.jsp?method=16', {}, {
    getData: {
      method: 'GET',
      isArray: false
    }
  });
});
