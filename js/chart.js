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
  // Definiere daten
  $scope.data = {
    src: 'js/data.json',
    rawdata: ''
  };

  D3JsonLoader($scope.data.src, function (data)
  {
    console.log('Daten Geladen');
    $scope.data.rawdata = data;
    $scope.$digest();
  });

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
      console.log('Treemap: Draw: scope.data:' + data);
      var house = new House();
      house.initialize(data);
      var treemap = new Treemap(svg, house, width, height);
    };


    // define restrictions to Element, accepted values
    return {
      restrict: 'EA',
      scope:
      {
        data: '=',
        width : '=',
        height : '='
      },

      compile: function (element, attrs, transclude)
      {
        // Create a SVG root element
        var svg = d3.select(element[0]).append('svg');
        console.log(attrs);

        // Define the dimensions for the chart when not definde
        if (width == undefined){
          console.log('Weite nicht definiert');
          var width = 800;
        }
        if (height == undefined){
          var height = 600;
        }



        // Return the link function
        return function (scope, element, attrs)
        {
          //draw(svg, width, height, scope.data);
          // Watch the data attribute of the scope
          scope.$watch('data', function (newVal, oldVal, scope)
          {
            // Update the chart
            draw(svg, scope.data, width, height);
          }, true);
        };
      }

    };
  }
]);
