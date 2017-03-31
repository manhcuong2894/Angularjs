+App.controller('HomeCtrl', function($state, $scope) {
  console.log('home');
  $scope.title = 'Quản lý người dùng';

  $scope.iframeHeight = window.innerHeight;

  $scope.save = function () {
    if ($scope.formDemo.$invalid) {
      angular.forEach($scope.formDemo.$error, function (field) {
        angular.forEach(field, function (errorField) {
          errorField.$setTouched();
        })
      });
      return;
    }

    return false;
  }
});
