+App.factory('Document', ['Restangular', function(Restangular) {
  return Restangular.service('/document');
}]);
