+App.controller('RequestReopenCtrl', function ($scope, $stateParams, $timeout, $window, $state, Request, Handling, principal, toastr, RequestConfig, $rootScope, Right, Restangular, localStorageService) {

  $scope.title = 'Quản lý yêu cầu';
  $scope.user = principal.getUser();
  $scope.levelSearchs = RequestConfig.requestLevel;

  // $(document).ready(function() {
  $timeout(function () {
    $(".select_assigned").select2({
      placeholder: "Chọn người gán xử lý"
    });

    $(".select_receiver").select2({
      placeholder: "Chọn người chịu trách nhiệm"
    });

  }, 1000);
  // });

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

  $scope.fetch = function () {
    Request.one('get-request-by-id').get({id: $stateParams.id}).then(function (result) {
      $scope.request = result.data;
      $scope.request.TT = result.data.status;
      $scope.request.assignedCurrent = result.data.assigned.username;
      $scope.request.responsibleCurrent = result.data.responsible.username;
      $scope.request.level = (result.data.level).toString();
      $scope.request.assigned = (result.data.assigned.id).toString();
      $scope.request.responsible = (result.data.responsible.id).toString();
    });
  };

  $scope.getRightGroup = function () {
    Right.one('get-right-group-select').get().then(function (result) {
      $scope.rightGroups = result.data;
    });
  };

  $scope.getRightGroupByManager = function () {
    Right.one('get-right-group-select-by-manager').get().then(function (result) {
      $scope.rightGroupByManagers = result.data;
    });
  };

  $scope.reopenRequest = function () {
    $scope.request.handlers = $scope.user.id;
    $scope.request.status = 4;

    Restangular.one('request').one('check-request?id=' + $stateParams.id).customPUT($scope.request).then(function (data) {
      toastr.success('Mở lại yêu cầu thành công', 'Thông báo!');
      $window.history.back();
    }, function (err) {
      toastr.error('Mở lại yêu cầu không thành công', 'Lỗi!');
    });
  };

  $scope.download = function (id) {
    Request.one().one('download-file').get({id: id}).then(function (result) {
      var url = Request.one().one('download-file').getRestangularUrl();
      var str = jQuery.param({id: id});
      var uri = url + '?' + str;

      window.open(uri, "_blank");

      return false;
    });
  };

  $scope.getHandlingRequestById = function () {
    Request.one('get-history-request-by-id').get({id: $stateParams.id}).then(function (result) {
      $scope.handlingRequests = result.data;
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

  $scope.fetch();
  $scope.getRightGroup();
  $scope.getRightGroupByManager();
  $scope.getHandlingRequestById();
});
