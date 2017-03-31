+App.factory('Request', ['Restangular', function(Restangular) {
  return Restangular.service('/request');
}]);
