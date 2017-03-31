+App.controller('DocumentAddCtrl', function ($scope, $state, Restangular, Document, Service, toastr, principal) {

  $scope.title = 'Quản lý tài liệu';
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

  $scope.uploadFile = '';

  $scope.document = {
    fileName: '',
    service: '',
    description: ''
  };

  $scope.save = function () {
    $scope.document.uploadPerson = $scope.user.id;

    var fd = new FormData();
    fd.append('data', JSON.stringify($scope.document));
    fd.append('uploadFile', $scope.uploadFile);

    Restangular
      .one('document')
      .one('add-new-document')
      .withHttpConfig({transformRequest: angular.identity})
      .customPOST(fd, undefined, undefined,{'Content-Type': undefined})
      .then(function (data) {
        if(data.status == 0){
          toastr.error(data.message, 'Lỗi!');
        }else {
          toastr.success('Thêm mới thành công', 'Thông báo!');
          $state.go('document.list');
        }
      }, function (response) {
        toastr.error('Thêm mới không thành công', 'Lỗi!');
      });

  };

  $scope.getService = function () {
    Service.one('get-all-service-no-paging').get().then(function (result) {
      $scope.services = result.data;
    });
  };

  $scope.getService();
});
