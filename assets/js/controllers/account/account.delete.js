+App.controller('AccountDeleteCtrl', function($scope, $stateParams, $state, Restangular, Account, AccountConfig, toastr) {

  $scope.title = 'Quản lý tài khoản';
  $scope.accountStatus = AccountConfig.accountStatus;

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

  $scope.fetch = function () {
    Account.one('get-user-by-id').get({id: $stateParams.id}).then(function (result) {
      $scope.account = result.data;
      if(result.data.avatar != null && result.data.avatar != '') {
        var url = result.data.avatar;
        $scope.avatar = url.split('\\').pop();
      }
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

  $scope.getManagerLabel = function (status) {
    var $lb = '';
    _.forEach(AccountConfig.accountManager, function (v) {
      if (status == v.value) {
        $lb = v.label;
      }
    });
    return $lb;
  };

  $scope.delAccount = function(id) {
    Account.one().one('delete-user').remove({id: id}).then(function (result) {
      toastr.success('Xóa tài khoản thành công', 'Thông báo!');
      $state.go('account.list');
    }, function (err) {
      toastr.error('Xóa tài khoản không thành công', 'Lỗi!');
    });
  };

  $scope.fetch();
});
