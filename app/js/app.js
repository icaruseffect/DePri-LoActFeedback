'use strict';
/* jshint -W109 */
// aktiviert Linter

// Definiere ( App-Name, [ Abhängigkeiten])
var app = angular.module('app', ['webdataService', 'dataService']);

/* Initialisierung Controller mit $scope und dataService
 der Rückgabewert von dataService wird im Scope gespeichert */
app.controller('MainCtrl', function ($scope, dataService, webdataService)
{
  // Declare initial Variables
  $scope.data = {};
  $scope.data.history = {};

  /*
  This function gets the Data from the local json file
  */
  $scope.updateData = function ()
  {
    dataService.getData(function (data)
    {
      $scope.data.history = $scope.data;
      $scope.data.now = data;
      console.log("Daten aktualisiert");
    });
  };

  /*
  This function gets the Data from the remote API and attaches it to the scope
  */
  $scope.webupdateData = function ()
  {
    webdataService.getData(function (data)
    {
      $scope.data.history = $scope.data;
      $scope.data.now = data;
      //Debug Ausgabe auf Konsole
      console.log("Daten aktualisiert");
    });
  };
});


/*
  Directives
*/
app.directive('collection', function ()
{
  return {
    restrict: "E",
    replace: true,
    scope:
    {
      collection: '='
    },
    template: "<ul><member ng-repeat='member in collection' member='member'></member></ul>"
  };
});

app.directive('member', function ($compile)
{
  return {
    restrict: "E",
    replace: true,
    scope:
    {
      member: '='
    },
    template: "<li>{{member.name}}</li>",
    link: function (scope, element, attrs)
    {
      if (angular.isArray(scope.member.children))
      {
        element.append("<collection collection='member.children'></collection>");
        $compile(element.contents())(scope);
      }
    }
  };
});
