+App.controller('AccountAddCtrl', function ($scope, $state, toastr, Restangular, Right, Account, principal) {

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
    username: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    roleId: '',
    manager: '1',
    status: 1,
    createBy: $scope.user.username
  };

  $scope.save = function () {

    var fd = new FormData();
    fd.append('data', JSON.stringify($scope.account));
    fd.append('uploadFile', $scope.uploadFile);
    Restangular
      .one('user')
      .one('add-new-user')
      .withHttpConfig({transformRequest: angular.identity})
      .customPOST(fd, undefined, undefined,{'Content-Type': undefined})
      .then(function (err) {
        if(err.status == 0){
          toastr.error(err.message, 'Lỗi!');
        }else {
          toastr.success('Thêm mới thành công', 'Thông báo!');
          $state.go('account.list');
        }
      }, function (response) {
        if (response.data.status == 5) {
          toastr.error(response.data.message, 'Lỗi!');
        }else {
          toastr.error('Thêm mới không thành công', 'Lỗi!');
        }
      });

    // Restangular.all('user/add-new-user').post($scope.account).then(function (data) {
    //   toastr.success('Thêm mới thành công', 'Thông báo!');
    //   $state.go('account.list');
    // }, function (err) {
    //   if (err.data.status == 5) {
    //     toastr.error('Tên đăng nhập đã tồn tại', 'Lỗi!');
    //   } else {
    //     toastr.error('Thêm mới không thành công', 'Lỗi!');
    //   }
    // });
  };

  $scope.getGroupRole = function () {
    Right.one('get-all-right-group').get().then(function (result) {
      $scope.rights = result.data;
      $scope.account.roleId = result.data[0].id;
      $scope.rights.id = (result.data.id).toString();
    });
  };

  $scope.getGroupRole();

});
