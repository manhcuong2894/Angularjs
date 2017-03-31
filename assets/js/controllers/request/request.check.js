+App.controller('RequestCheckCtrl', function ($scope, $stateParams, $timeout, $state, Request, Handling, Right, principal, $window, $rootScope, RequestConfig, Restangular, toastr, localStorageService) {

  $scope.title = 'Quản lý yêu cầu';
  $scope.user = principal.getUser();

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
      console.log(result.data.assigned.id);
      $scope.request = result.data;
      $scope.request.TT = result.data.status;
      $scope.request.assignedCurrent = result.data.assigned.username;
      $scope.request.responsibleCurrent = result.data.responsible.username;
      $scope.request.assigned = (result.data.assigned.id).toString();
      $scope.request.responsible = (result.data.responsible.id).toString();

      if (result.data.status == 1 || result.data.status == 4 || result.data.status == 2) {
        $scope.request.status = 3;
        $scope.request.status = ($scope.request.status).toString();
        $scope.request.contentHandling = 'Tiếp nhận và đang xử lý...';
      } else if (result.data.status == 3) {
        $scope.request.status = 3;
        $scope.request.status = ($scope.request.status).toString();
        $scope.request.contentHandling = 'Tiếp nhận và đang xử lý...';
      }

    });
  };

  $scope.getRightGroup = function () {
    Right.one('get-right-group-select1').get().then(function (result) {
      $scope.rightGroups = result.data;
    });
  };

  $scope.getRightGroupByManager = function () {
    Right.one('get-right-group-select-by-manager').get().then(function (result) {
      $scope.rightGroupByManagers = result.data;
    });
  };

  // $scope.checkComplaint = function () {
  //   if ($scope.requestEditForm.$invalid) {
  //     angular.forEach($scope.requestEditForm.$error, function (field) {
  //       angular.forEach(field, function (errorField) {
  //         errorField.$setTouched();
  //       })
  //     });
  //     return;
  //   }
  //
  //   $scope.request.IDNguoiXuLy = localStorage.getItem('idUser');
  //
  //   if ($scope.request.KhieuNaiRotTin == 0){
  //     $scope.request.NguyenNhan = null;
  //   }
  //
  //   Restangular.one('request').one('checkRequest?ID=' + $stateParams.ID).customPUT($scope.request).then(function (data) {
  //     Flash.create('success', 'Duyệt yêu cầu thành công');
  //     $window.history.back();
  //     $rootScope.$emit("myMenuUser");
  //   }, function (err) {
  //     Flash.create('danger', 'Duyệt yêu cầu không thành công!');
  //   });
  // };

  $scope.checkRequest = function () {
    $scope.request.handlers = $scope.user.id;
    console.log($scope.request.assigned);

    Restangular.one('request').one('check-request?id=' + $stateParams.id).customPUT($scope.request).then(function (data) {
      toastr.success('Duyệt yêu cầu thành công', 'Thông báo!');
      $window.history.back();
    }, function (err) {
      toastr.error('Duyệt yêu cầu không thành công', 'Lỗi!');
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
