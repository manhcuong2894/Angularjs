+App.factory('Service', ['Restangular', function(Restangular) {
  return Restangular.service('/service');
}]);
