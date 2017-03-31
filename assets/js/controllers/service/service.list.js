+App.controller('ServiceListCtrl', function ($scope, $state, Service, toastr, Right, principal) {

  $scope.title = 'Quản lý dịch vụ';
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

  $scope.service = {
    short_name: ''
  };

  $scope.totalService = 0;
  $scope.servicePerPage = 10;
  $scope.pagination = {
    current: 1
  };

  $scope.pageChanged = function (newPage) {
    $scope.getService(newPage);
  };

  $scope.getService = function (pageNumber) {
    $scope.service['page'] = pageNumber || $scope.pagination.current;
    $scope.service['limit'] = $scope.servicePerPage;
    Service.one().one('get-all-service').get({
      page: $scope.service.page,
      limit: $scope.service.limit,
      short_name: $scope.service.short_name
    }).then(function (result) {
      $scope.services = result.data;
      $scope.totalService = result.total;
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

  $scope.getInfo = function (id, status) {
    $scope.idService = id;
    $scope.statusService = status;
  };

  $scope.approvalStatus = function(id) {
    Service.one().one('/approval-status-service')
      .put({id: id}).then(function (data) {
      $('#confirm_service').modal('hide');
      toastr.success('Cập nhật trạng thái thành công', 'Thông báo!');
      $scope.getService();
    }, function (err) {
      $('#confirm_service').modal('hide');
      toastr.error('Cập nhật trạng thái không thành công', 'Lỗi!');
    });
  };

  $scope.getService();
});
