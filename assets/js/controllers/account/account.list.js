+App.controller('AccountListCtrl', function ($scope, $state, Account, AccountConfig, Right, toastr, principal) {
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
    email: '',
    roleId: '',
    status: ''
  };

  $scope.accountStatus = AccountConfig.accountStatus;

  $scope.totalAccount = 0;
  $scope.accountPerPage = 10;
  $scope.pagination = {
    current: 1
  };

  $scope.pageChanged = function (newPage) {
    $scope.getAccount(newPage);
  };

  $scope.getAccount = function (pageNumber) {
    $scope.account['page'] = pageNumber || $scope.pagination.current;
    $scope.account['limit'] = $scope.accountPerPage;
    Account.one().one('get-all-user').get({
      page: $scope.account.page,
      limit: $scope.account.limit,
      username: $scope.account.username,
      email: $scope.account.email,
      roleId: $scope.account.roleId,
      status: $scope.account.status
    }).then(function (result) {
      $scope.accounts = result.data;
      $scope.totalAccount = result.total;
      if (result.data.length < 1) {
        $scope.noData = 0;
      } else {
        $scope.noData = 1;
      }
    });
  };

  Right.one('get-right-group-by-id-for-permission').get({id: $scope.user.roleId}).then(function (result) {
    tmp = result.data[0].features;
    $scope.checkRight = function (id) {
      if ($scope.user.roleId == 10) {
        return true;
      }
      for (var i = 0; i < tmp.length; i++) {
        if (tmp[i].id == id) {
          return true;
        }
      }
      return false;
    };
  });

  $scope.getGroupRole = function () {
    Right.one('get-all-right-group').get().then(function (result) {
      $scope.rights = result.data;
      $scope.rights.id = (result.data.id).toString();
    });
  };

  $scope.getInfo = function (id, status) {
    $scope.idAccount = id;
    $scope.statusAccount = status;
  };

  $scope.approvalStatus = function (id) {
    Account.one().one('/approval-status-user')
      .put({id: id}).then(function (data) {
      $('#confirm_account').modal('hide');
      toastr.success('Cập nhật trạng thái thành công', 'Thông báo!');
      $scope.getAccount();
    }, function (err) {
      $('#confirm_account').modal('hide');
      toastr.error('Cập nhật trạng thái không thành công', 'Lỗi!');
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

  $scope.getAccount();
  $scope.getGroupRole();
});
