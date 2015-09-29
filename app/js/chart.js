'use strict';
/*
Charting module contains all Code for creating a chart with a dircetive
*/
var treemap = angular.module('zoomTreemap', []);

// D3 Factory, stellt D3js als injectable Dependency zur Verfügung
treemap.factory('d3', function ()
{
  return d3;
});



treemap.factory('D3JsonLoader', ['d3',
  function (d3)
  {
    return function (path, callback)
    {
      d3.json(path, callback);
    };
  }
]);


treemap.controller('ChartCtrl', ['$scope', 'D3JsonLoader', function ($scope, D3JsonLoader)
{
  var position = 0;
  // Definiere daten
  $scope.data = {
    //src: 'js/collected.json',
    src: 'js/data.json',
    rawdata: ''
  };

  $scope.update = function ()
  {
    new D3JsonLoader($scope.data.src, function (data)
    {
      //console.log('Daten Geladen, timestamp:' + data[position].timestamp);
      //console.log('Daten Geladen, timestamp:' + data.timestamp)
      //$scope.data.rawdata = data[position];
      $scope.data.rawdata = data;
      position += 1;
      $scope.$digest();
    });
  };

  $scope.update();


}]);


// Chart Directive
treemap.directive('zoomTreemapElement', ['d3',
  function (d3)
  {
    var draw = function (svg, data, width, height)
      /*
      Diese Funktion nimmt die Daten an, parst diese in ein neues Haus Objekt
      und erzeugt anschließend eine neue Treemap
      */
      {
        var house = new House();
        house.initialize(data);
        var chart =  new Treemap(svg, house, width, height);
        console.log(d3.selectAll(".child").data()[1].getFullName());
      };


    // define restrictions to Element, accepted values
    return {
      restrict: 'EA',
      scope:
      {
        data: '=',
        width: '=',
        height: '@'
      },

      compile: function (element, attrs, transclude)
      {
        // Create a SVG root element
        var svg = d3.select(element[0]).append('svg');

        // Define the dimensions for the chart when not definde
        if (width == undefined)
        {
          console.log('Angular:Treemap:Directive Weite nicht definiert');
          var width = 800;
        }
        if (height == undefined)
        {
          console.log('Angular:Treemap:Directive Höhe nicht definiert');
          var height = 600;
        }



        // Return the link function
        return function (scope, element, attrs)
        {
          //draw(svg, width, height, scope.data);
          // Watch the data attribute of the scope
          scope.$watch('data', function (newVal, oldVal, scope)
          {
            console.log("zoomTreemapElement: Daten Aktualisiert");
            // Update the chart
            if (scope.data !== '')
            {draw(svg, scope.data, width, height);}
          }, true);
        };
      }

    };
  }
]);
