// Application Module
angular.module('myApp', [])
  // Main application controller
  .controller('MainCtrl', ['$scope', '$interval',
    function($scope, $interval) {
      var time = new Date('2014-01-01 00:00:00 +0100');
      // Random data point generator
      var randPoint = function() {
          var rand = Math.random;
          return {
            time: time.toString(),
            visitors: rand() * 100
          };
        }
        // We store a list of logs
      $scope.logs = [randPoint()];
      $interval(function() {
        time.setSeconds(time.getSeconds() + 1);
        $scope.logs.push(randPoint());
      }, 1000);
    }
  ]);
