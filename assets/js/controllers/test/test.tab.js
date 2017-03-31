// var app = angular.module('chromeTabsApp', ['ui.bootstrap']);
+App.controller('TestTabCtrl', ['$scope', function($scope) {
  var counter = 1;
  $scope.tabs = [];

  var addTab = function() {
    $scope.tabs.push({
      title: 'Tab ' + counter,
      content: 'Tab ' + counter
    });
    counter++;
    $scope.tabs[$scope.tabs.length - 1].active = true;
  };

  var removeTab = function(event, index) {
    event.preventDefault();
    event.stopPropagation();
    $scope.tabs.splice(index, 1);
  };

  $scope.addTab = addTab;
  $scope.removeTab = removeTab;

  // for (var i = 0; i < 5; i++) {
  //   addTab();
  // }
}]);