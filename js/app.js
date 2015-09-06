/* @flow */
// aktiviert den Flow-Linter

// Definiere ( App-Name, [ Abhängigkeiten])
var app = angular.module('app', ['webdataService','dataService','EnergyTreemap']);

/* Initialisierung Controller mit $scope und dataService
 der Rückgabewert von dataService wird im Scope gespeichert */
app.controller('MainCtrl', function ($scope, dataService, webdataService) {

  // This function gets the Data from the local json file
  $scope.updateData = function () {
    dataService.getData(function (data) {
      $scope.data = data;
      //$scope.children = data.children;
      //Debug Ausgabe auf Konsole
      console.log("Daten aktualisiert");
    });
  };
  $scope.webupdateData = function () {
    webdataService.getData(function (data) {
      $scope.data = data;
      //$scope.children = data.children;
      //Debug Ausgabe auf Konsole
      console.log("Daten aktualisiert");
    });
  };

});


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

/*
  Directives
*/
var chart = angular.module('EnergyTreemap', [])
  // D3 Factory
chart.factory('d3', function () {
  /* We could declare locals or other D3.js
  specific configurations here. */
  return d3;
});
chart.directive('zoomD3Treemap', ["d3",
  function (d3) {
    function draw(svg, width, height, data) {
      svg
        .attr('width', width)
        .attr('height', height);
      // code continues here
    }



    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      compile: function (element, attrs, transclude) {
        // Create a SVG root element
        var svg = d3.select(element[0]).append('svg');
        svg.append('g').attr('class', 'data');
        svg.append('g').attr('class', 'x-axis axis');
        svg.append('g').attr('class', 'y-axis axis');
        // Define the dimensions for the chart
        var width = 600,
          height = 300;
        // Return the link function
        return function (scope, element, attrs) {
          // Watch the data attribute of the scope
          scope.$watch('data', function (newVal, oldVal, scope) {
            // Update the chart
            draw(svg, width, height, scope.data);
          }, true);
        };
      }
    };
  }
]);
