+App.factory('MyRequest', ['Restangular', function(Restangular) {
  return Restangular.service('/myRequest');
}]);
