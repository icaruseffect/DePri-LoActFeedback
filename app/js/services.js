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
