+App.controller('RequestAddCtrl', function($scope, $state, $rootScope, $filter, Restangular, principal, Service, Right, localStorageService, toastr, RequestConfig) {

  $scope.title = 'Quản lý yêu cầu';
  $scope.user = principal.getUser();
  $scope.levelSearchs = RequestConfig.requestLevel;

  $(document).ready(function() {
    $(".select2_group").select2({});

    $(".select_assigned").select2({
      placeholder: "Chọn người gán xử lý"
    });

    $(".select_receiver").select2({
      placeholder: "Chọn người chịu trách nhiệm"
    });
  });

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

  $scope.regLeapYear = /((^(0?[1-9]|(3[01])|[12][0-9])([\/])(10|12|0?[13578])([\/])((1[8-9]\d{2})|([2-9]\d{3}))$)|(^(30|[12][0-9]|0?[1-9])([\/])(11|0?[469])([\/])((1[8-9]\d{2})|([2-9]\d{3}))$)|(^(2[0-8]|1[0-9]|0?[1-9])([\/])(0?2)([\/])((1[8-9]\d{2})|([2-9]\d{3}))$)|(^(2[0-8]|1[0-9]|0?[1-9])([\/])(0?2)([\/])((1[8-9]\d{2})|([2-9]\d{3}))$)|(^(29)([\/])(0?2)([\/])([2468][048]00)$)|(^(29)([\/])(0?2)([\/])([3579][26]00)$)|(^(29)([\/])(0?2)([\/])([1][89][0][48])$)|(^(29)([\/])(0?2)([\/])([2-9][0-9][0][48])$)|(^(29)([\/])(0?2)([\/])([1][89][2468][048])$)|(^(29)([\/])(0?2)([\/])([2-9][0-9][2468][048])$)|(^(29)([\/])(0?2)([\/])([1][89][13579][26])$)|(^(29)([\/])(0?2)([\/])([2-9][0-9][13579][26]))$)|((^(0?[1-9]|(3[01])|[12][0-9])([\/])(10|12|0?[13578])([\/])((1[8-9]\d{2})|([2-9]\d{3}) (0[0-9]|1\d|2[0123])\:(0[0-9]|1\d|2\d|3\d|4\d|5\d)\:(0[0-9]|1\d|2\d|3\d|4\d|5\d))$)|(^(30|[12][0-9]|0?[1-9])([\/])(11|0?[469])([\/])((1[8-9]\d{2})|([2-9]\d{3}) (0[0-9]|1\d|2[0123])\:(0[0-9]|1\d|2\d|3\d|4\d|5\d)\:(0[0-9]|1\d|2\d|3\d|4\d|5\d))$)|(^(2[0-8]|1[0-9]|0?[1-9])([\/])(0?2)([\/])((1[8-9]\d{2})|([2-9]\d{3}) (0[0-9]|1\d|2[0123])\:(0[0-9]|1\d|2\d|3\d|4\d|5\d)\:(0[0-9]|1\d|2\d|3\d|4\d|5\d))$)|(^(2[0-8]|1[0-9]|0?[1-9])([\/])(0?2)([\/])((1[8-9]\d{2})|([2-9]\d{3}) (0[0-9]|1\d|2[0123])\:(0[0-9]|1\d|2\d|3\d|4\d|5\d)\:(0[0-9]|1\d|2\d|3\d|4\d|5\d))$)|(^(29)([\/])(0?2)([\/])([2468][048]00) (0[0-9]|1\d|2[0123])\:(0[0-9]|1\d|2\d|3\d|4\d|5\d)\:(0[0-9]|1\d|2\d|3\d|4\d|5\d)$)|(^(29)([\/])(0?2)([\/])([3579][26]00) (0[0-9]|1\d|2[0123])\:(0[0-9]|1\d|2\d|3\d|4\d|5\d)\:(0[0-9]|1\d|2\d|3\d|4\d|5\d)$)|(^(29)([\/])(0?2)([\/])([1][89][0][48]) (0[0-9]|1\d|2[0123])\:(0[0-9]|1\d|2\d|3\d|4\d|5\d)\:(0[0-9]|1\d|2\d|3\d|4\d|5\d)$)|(^(29)([\/])(0?2)([\/])([2-9][0-9][0][48] (0[0-9]|1\d|2[0123])\:(0[0-9]|1\d|2\d|3\d|4\d|5\d)\:(0[0-9]|1\d|2\d|3\d|4\d|5\d))$)|(^(29)([\/])(0?2)([\/])([1][89][2468][048]) (0[0-9]|1\d|2[0123])\:(0[0-9]|1\d|2\d|3\d|4\d|5\d)\:(0[0-9]|1\d|2\d|3\d|4\d|5\d)$)|(^(29)([\/])(0?2)([\/])([2-9][0-9][2468][048]) (0[0-9]|1\d|2[0123])\:(0[0-9]|1\d|2\d|3\d|4\d|5\d)\:(0[0-9]|1\d|2\d|3\d|4\d|5\d)$)|(^(29)([\/])(0?2)([\/])([1][89][13579][26]) (0[0-9]|1\d|2[0123])\:(0[0-9]|1\d|2\d|3\d|4\d|5\d)\:(0[0-9]|1\d|2\d|3\d|4\d|5\d)$)|(^(29)([\/])(0?2)([\/])([2-9][0-9][13579][26]) (0[0-9]|1\d|2[0123])\:(0[0-9]|1\d|2\d|3\d|4\d|5\d)\:(0[0-9]|1\d|2\d|3\d|4\d|5\d))$)/;

  $scope.uploadFile = '';

  var jsonString = {
    id: '',
    shortName: 'Tất cả'
  };

  $scope.services = [
    {
      id: '',
      shortName: 'Tất cả'
    }
  ];

  $scope.request = {
    service: '',
    level: '',
    channel: '',
    timeRequest: '',
    contact: '',
    sla: '',
    number: '',
    status: 1,
    assigned: '',
    responsible: '',
    content: '',
    file: ''
  };

  function dateString2Date(dateString) {
    var dt  = dateString.split(/\/|\s/);
    return new Date(dt.slice(0,3).reverse().join('-') + ' ' + dt[3]);
  }

  // $scope.save = function () {
  //   if ($scope.requestAddForm.$invalid) {
  //     angular.forEach($scope.requestAddForm.$error, function (field) {
  //       angular.forEach(field, function (errorField) {
  //         errorField.$setTouched();
  //       })
  //     });
  //     return;
  //   }
  //
  //   var abc = JSON.stringify($scope.request);
  //   $scope.requestSub = JSON.parse(abc);
  //   var dateValue = $scope.requestSub.ThoiGian;
  //   $scope.date = dateString2Date(dateValue);
  //   $scope.requestSub.ThoiGian = $filter('date')($scope.date, "MM-dd-yyyy HH:mm:ss");
  //
  //
  //   var fd = new FormData();
  //   fd.append('data', JSON.stringify($scope.requestSub));
  //   fd.append('uploadFile', $scope.uploadFile);
  //
  //   Restangular
  //     .one('request')
  //     .withHttpConfig({transformRequest: angular.identity})
  //     .customPOST(fd, undefined, undefined,{'Content-Type': undefined})
  //     .then(function (data) {
  //       if(data.status == 0){
  //         Flash.create('danger', data.message);
  //       }else {
  //         toastr.success('Thêm mới thành công', 'Thông báo!');
  //         $state.go('request.list');
  //         $rootScope.$emit("myMenuUser");
  //       }
  //     }, function (response) {
  //       toastr.error('Thêm mới không thành công', 'Lỗi!');
  //     });
  //
  //   return false;
  //
  // };

  $scope.saveAndSendMail = function () {
    $scope.request.createBy = $scope.user.id;

    var abc = JSON.stringify($scope.request);
    $scope.requestSub = JSON.parse(abc);
    var dateValue = $scope.requestSub.timeRequest;
    $scope.date = dateString2Date(dateValue);
    $scope.requestSub.timeRequest = $filter('date')($scope.date, "MM-dd-yyyy HH:mm:ss");

    var fd = new FormData();
    fd.append('data', JSON.stringify($scope.requestSub));
    fd.append('uploadFile', $scope.uploadFile);
    Restangular
      .one('request')
      .one('add-new-request')
      .withHttpConfig({transformRequest: angular.identity})
      .customPOST(fd, undefined, undefined,{'Content-Type': undefined})
      .then(function (data) {
        // localStorageService.set('userID', data.data.IDNguoiGanXuLy);
        // localStorageService.set('level', data.data.MucDo);

        if(data.status == 0){
          toastr.error(data.message, 'Lỗi!');
        }else {
          // localStorageService.set('tmp', 1);
          $state.go('request.list');
          toastr.success('Thêm mới thành công', 'Thông báo!');
        }
      }, function (response) {
        toastr.error('Thêm mới không thành công', 'Lỗi!');
      });

  };

  $scope.getService = function () {
    Service.one('get-all-service-no-paging').get().then(function (result) {
      $scope.services = result.data;
      $scope.services.splice(0, 0, jsonString);
    });
  };

  $scope.getServiceById = function () {
    Service.one('get-service-by-id').get({id: $scope.request.service}).then(function (result) {
      $scope.request.number = result.data.number;
      $scope.request.sla = result.data.sla;
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

  $scope.getStatusLabel = function (status) {
    var $lb = '';
    _.forEach(RequestConfig.requestStatus, function (v) {
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

  $scope.getService();
  $scope.getRightGroup();
  $scope.getRightGroupByManager();
});
