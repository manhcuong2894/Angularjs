+App.controller('AuthChangepasswordCtrl', function($state, $scope, Restangular, authorization, toastr, principal) {

  $scope.title = 'Thay đổi mật khẩu';

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
    current_pass: '',
    new_pass: ''
  };

  $scope.change = function(){
    console.log('aaa');
    Restangular.one('auth').one('change-password?id=' + $scope.user.id).customPUT($scope.account).then(function (data) {
      toastr.success('Thay đổi mật khẩu thành công', 'Thông báo!');
      authorization.logout();
      $state.go('login');
    }, function (err) {
      toastr.error(err.data.message, 'Lỗi!');
    });

  }

});
