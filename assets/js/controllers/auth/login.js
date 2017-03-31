+App.controller('AuthLoginCtrl', ['$scope', '$state', 'principal', '$auth', 'toastr', function ($scope, $state, principal, $auth, toastr) {
  $scope.info = {};

  $scope.login = function () {
    if ($scope.loginForm.$invalid) {
      angular.forEach($scope.loginForm.$error, function (field) {
        angular.forEach(field, function(errorField){
          errorField.$setTouched();
        })
      });
      return;
    }

    // here, we fake authenticating and give a fake user
    principal.authenticate($scope.info).then(function (identity) {
      toastr.success('Đăng nhập thành công', 'Thông báo!');
      if ($scope.returnToState && $scope.returnToState.name != 'login') {
        $state.go($scope.returnToState.name, $scope.returnToStateParams);
        $scope.returnToState = undefined;
        $scope.returnToStateParams = undefined;
      } else {
        if (identity.roleId == 10){
          $state.go('auth.changepassword');
        }else {
          $state.go('auth.changepassword');
        }
      }
    }, function(err) {
      if(err.status == 401) {
        toastr.error(err.data.message, 'Lỗi!');
      } else if(err.status == 500) {
        toastr.error('Lỗi máy chủ nội bộ, vui lòng thử lại sau!', 'Lỗi!');
      } else {
        toastr.error('Thông tin tài khoản không hợp lệ!', 'Lỗi!');
      }
    });

    return false;
  };
}]);
