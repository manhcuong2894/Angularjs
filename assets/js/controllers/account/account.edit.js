+App.controller('AccountEditCtrl', function ($scope, $stateParams, $state, principal, Restangular, toastr, Account, Right, AccountConfig) {

  $scope.title = 'Quản lý người dùng';
  $scope.user = principal.getUser();

  // Panel toolbox
  $(document).ready(function() {
    $('.collapse-link').on('click', function() {
      var $BOX_PANEL = $(this).closest('.x_panel'),
        $ICON = $(this).find('i'),
        $BOX_CONTENT = $BOX_PANEL.find('.x_content');

      // fix for some div with hardcoded fix class
      if ($BOX_PANEL.attr('style')) {
        $BOX_CONTENT.slideToggle(200, function(){
          $BOX_PANEL.removeAttr('style');
        });
      } else {
        $BOX_CONTENT.slideToggle(200);
        $BOX_PANEL.css('height', 'auto');
      }

      $ICON.toggleClass('fa-chevron-up fa-chevron-down');
    });

    $('.close-link').click(function () {
      var $BOX_PANEL = $(this).closest('.x_panel');

      $BOX_PANEL.remove();
    });
  });
// /Panel toolbox

  $scope.account = {
    editedBy: $scope.user.username
  };

  $scope.accountStatus = AccountConfig.accountStatus;

  $scope.fetch = function () {
    Account.one('get-user-by-id').get({id: $stateParams.id}).then(function (result) {
      $scope.account = result.data;
      $scope.account.roleId = result.data.roleId.id;
      $scope.account.status = (result.data.status).toString();
      if(result.data.avatar != null && result.data.avatar != '') {
        $scope.avatar = result.data.avatar;
      }
    });
  };

  $scope.updateAccount = function () {
    var fd = new FormData();
    fd.append('data', JSON.stringify($scope.account));
    fd.append('uploadFile', $scope.uploadFile);
    Restangular
      .one('user')
      .one('update-user?id=' + $stateParams.id)
      .withHttpConfig({transformRequest: angular.identity})
      .customPUT(fd, undefined, undefined, {'Content-Type': undefined})
      .then(function (data) {
        if (data.status == 0) {
          toastr.error(data.message, 'Lỗi!');
        } else {
          toastr.success('Cập nhật thành công', 'Thông báo!');
          $state.go('account.list');
        }
      }, function (response) {
        if (response.data.status == 5) {
          toastr.error(response.data.message, 'Lỗi!');
        } else {
          toastr.error('Cập nhật không thành công', 'Lỗi!');
        }
      });

    // Restangular.one('user').one('update-user?id=' + $stateParams.id).customPUT($scope.account).then(function (data) {
    //   toastr.success('Cập nhật thành công', 'Thông báo!');
    //   $state.go('account.list');
    // }, function (err) {
    //   if(err.data.status == 5){
    //     toastr.error('Tên đăng nhập đã tồn tại', 'Lỗi!');
    //   }else {
    //     toastr.success('Cập nhật không thành công', 'Lỗi!');
    //   }
    // });
  };

  $scope.getGroupRole = function () {
    Right.one('get-all-right-group').get().then(function (result) {
      $scope.rights = result.data;
      $scope.rights.id = (result.data.id).toString();
    });
  };

  $scope.getStatusLabel = function (status) {
    var $lb = '';
    _.forEach(AccountConfig.accountStatus, function (v) {
      if (status == v.value) {
        $lb = v.label;
      }
    });
    return $lb;
  };

  $scope.getGroupRole();
  $scope.fetch();
});

