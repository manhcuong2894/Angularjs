+App.controller('AccountResetCtrl', function ($scope, $stateParams, $state, Account, Restangular, toastr) {
  $scope.title = 'Quản lý người dùng';

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

  $scope.accounts = {
    password: ''
  };

  $scope.fetch = function () {
    Account.one('get-user-by-id').get({id: $stateParams.id}).then(function (result) {
      $scope.account = result.data;
    });
  };


  $scope.resetPassword = function () {
    Restangular.one('user').one('reset-password?id=' + $stateParams.id).customPUT($scope.accounts).then(function (data) {
      toastr.success('Cập nhật thành công', 'Thông báo!');
      $state.go('account.list');
    }, function (err) {
      toastr.error('Cập nhật không thành công', 'Lỗi!');
    });
  };

  $scope.fetch();
});
