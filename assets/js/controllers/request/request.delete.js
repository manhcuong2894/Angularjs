+App.controller('RequestDeleteCtrl', function($scope, $stateParams, $state, toastr, Request, Restangular, Handling, RequestConfig, localStorageService, $window) {

  $scope.title = 'Quản lý yêu cầu';

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

  localStorageService.set('sessionParam', 5);

  $scope.detailRequests = {};

  $scope.fetch = function () {
    Request.one('get-request-by-id').get({id: $stateParams.id}).then(function (result) {
      $scope.detailRequests = result.data;
      $scope.detailRequests.channel = parseInt(result.data.channel);
    });
  };

  $scope.getHandlingRequestById = function () {
    Request.one('get-history-request-by-id').get({id: $stateParams.id}).then(function (result) {
      $scope.handlingRequests = result.data;
    });
  };

  $scope.deleteRequest = function() {
    $scope.detailRequests.status = 6;
    Restangular.one('request').one('check-request?id=' + $stateParams.id).customPUT($scope.detailRequests).then(function (data) {
      toastr.success('Xóa yêu cầu thành công', 'Thông báo!');
      $window.history.back();
    }, function (err) {
      toastr.error('Xóa yêu cầu không thành công', 'Lỗi!');
    });
  };

  $scope.download = function (id) {
    Request.one().one('download-file').get({id: id}).then(function (result) {
      var url = Request.one().one('download-file').getRestangularUrl();
      var str = jQuery.param({id: id});
      var uri = url+'?'+str;

      window.open(uri, "_blank");

      return false;
    });
  };

  $scope.getChannelLabel = function (status) {
    var $lb = '';
    _.forEach(RequestConfig.channelLabel, function (v) {
      if (status == v.value) {
        $lb = v.label;
      }
    });
    return $lb;
  };

  $scope.getLevelLabel = function (status) {
    var $lb = '';
    _.forEach(RequestConfig.requestLevel, function (v) {
      if (status == v.value) {
        $lb = v.label;
      }
    });
    return $lb;
  };

  $scope.getStatusLabel = function (status) {
    var $lb = '';
    _.forEach(RequestConfig.requestStatus, function (v) {
      if (status == v.value) {
        $lb = v.label;
      }
    });
    return $lb;
  };

  $scope.getStatusLabel1 = function (status) {
    var $lb = '';
    _.forEach(RequestConfig.requestStatus1, function (v) {
      if (status == v.value) {
        $lb = v.label;
      }
    });
    return $lb;
  };

  $scope.fetch();
  $scope.getHandlingRequestById();
});
