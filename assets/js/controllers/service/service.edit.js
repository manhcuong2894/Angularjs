+App.controller('ServiceEditCtrl', function ($scope, $stateParams, $state, Restangular, Service, toastr, principal, ServiceConfig) {

  $scope.title = 'Quản lý dịch vụ';
  $scope.user = principal.getUser();
  $scope.serviceSLA = ServiceConfig.serviceSLA;
  $scope.service = {};

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
    Service.one('get-service-by-id').get({id: $stateParams.id}).then(function (result) {
      $scope.service = result.data;
    });
  };

  $scope.updateService = function () {
    $scope.service.editedBy =  $scope.user.username;
    console.log($scope.service);
    Restangular.one('service').one('update-service?id=' + $stateParams.id).customPUT($scope.service).then(function (data) {
      toastr.success('Cập nhật thành công', 'Thông báo!');
      $state.go('service.list');
    }, function (err) {
      if (err.data.status == 5) {
        toastr.error('Tên ngắn gọn đã tồn tại', 'Thông báo!');
      } else {
        toastr.error('Cập nhật không thành công', 'Lỗi!');
      }
    });
  };

  $scope.resetText = function() {
    $scope.service.shortName = '';
    $scope.service.serviceName = '';
    $scope.service.status = 0;
    $scope.service.description = '';
    $scope.service.sla = '1';
    $scope.service.number = '';
  };

  $scope.resetNumber = function () {
    $scope.service.number = '';
  };

  $scope.fetch();
});
