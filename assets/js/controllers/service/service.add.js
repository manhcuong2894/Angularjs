+App.controller('ServiceAddCtrl', function ($scope, $state, Restangular, principal, toastr, ServiceConfig) {

  $scope.title = 'Quản lý dịch vụ';
  $scope.user = principal.getUser();
  $scope.serviceSLA = ServiceConfig.serviceSLA;

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
    short_name: '',
    service_name: '',
    status: 1,
    description: '',
    sla: 1,
    number: ''
  };

  $scope.service.sla = ($scope.service.sla).toString();

  $scope.resetText = function() {
    $scope.service.short_name = '';
    $scope.service.service_name = '';
    $scope.service.status = 0;
    $scope.service.description = '';
    $scope.sla = 1;
    $scope.number = '';
  };

  $scope.save = function () {
    $scope.service.create_by = $scope.user.username;
    Restangular.all('service/add-new-service').post($scope.service).then(function (data) {
      toastr.success('Thêm mới thành công', 'Thông báo!');
      $state.go('service.list');
    }, function (err) {
      if(err.data.status == 5){
        toastr.error('Tên ngắn gọn đã tồn tại', 'Lỗi!');
      }else {
        toastr.error('Thêm mới không thành công', 'Lỗi!');
      }
    });
  };
});
