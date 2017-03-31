+App.factory('RestangularConfig', ['Restangular', function(Restangular) {
  return {
    setBaseUrl: function(url) {
      Restangular.setBaseUrl(url);
    },
    setToken: function(token) {
      Restangular.setDefaultHeaders({Authorization:'JWT '+ token});
    }
  }
}]);
