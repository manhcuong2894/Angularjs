+App.factory('Account', ['Restangular', function(Restangular) {
  return Restangular.service('/user');
}]);
