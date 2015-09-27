'use strict';
/* jshint -W109 */
// aktiviert Linter

// Definiere ( App-Name, [ Abhängigkeiten])
var app = angular.module('app', ['dataService', 'zoomTreemap']);

/* Initialisierung Controller mit $scope und dataService
 der Rückgabewert von dataService wird im Scope gespeichert */
app.controller('MainCtrl', function ($scope, dataService)
{
  // Declare initial Variables
  //$scope.data = {};

  /*
  This function gets the Data from the local json file
  */
  $scope.updateData = function ()
  {
    dataService.getData(function (data)
    {
      $scope.data = new House();
      $scope.data.initialize(data, null);
      console.log("Daten aktualisiert");
    });
  };

});
