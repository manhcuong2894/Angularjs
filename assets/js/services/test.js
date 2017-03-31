+App.factory('Test', ['Restangular', function(Restangular) {
  return Restangular.service('/test');
}]);
