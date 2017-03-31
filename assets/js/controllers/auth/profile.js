+App.controller('AuthProfileCtrl', function($scope, Account, principal, Restangular, toastr, $state, authorization) {
  $scope.title = 'Cập nhật hồ sơ cá nhân';
  $scope.user = principal.getUser();

  $scope.account = {};

  $scope.fetch = function () {
    Account.one('get-user-by-id').get({id: $scope.user.id}).then(function (result) {
      $scope.account = result.data;
      if(result.data.avatar != null && result.data.avatar != '') {
        $scope.avatar = result.data.avatar;
      }
    });
  };

  $scope.updateProfile = function () {
    var fd = new FormData();
    fd.append('data', JSON.stringify($scope.account));
    fd.append('uploadFile', $scope.uploadFile);
    Restangular
      .one('user')
      .one('update-user?id=' + $scope.user.id)
      .withHttpConfig({transformRequest: angular.identity})
      .customPUT(fd, undefined, undefined, {'Content-Type': undefined})
      .then(function (data) {
        if (data.status == 0) {
          toastr.error(data.message, 'Lỗi!');
        } else {
          toastr.success('Cập nhật thành công', 'Thông báo!');
          authorization.logout();
          $state.go('login');
        }
      }, function (response) {
        if (response.data.status == 5) {
          toastr.error(response.data.message, 'Lỗi!');
        } else {
          toastr.error('Cập nhật không thành công', 'Lỗi!');
        }
      });
  };

  $scope.fetch();
});
