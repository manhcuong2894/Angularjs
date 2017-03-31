+App.controller('RequestListCtrl', function ($scope, $state, Request, principal, Service, Right, $rootScope, RequestConfig, localStorageService) {
  $scope.title = 'Quản lý yêu cầu';
  $scope.user = principal.getUser();

  var tmp = '';

  $scope.statusSearchs = RequestConfig.requestStatus1;
  $scope.levelSearchs = RequestConfig.requestLevel;

  $(document).ready(function() {
    $(".select2_multiple").select2({
      id: '-1',
      maximumSelectionLength: 10,
      placeholder: "Chọn người xử lý",
      allowClear: true
    });

    $(".select_receiver").select2({
      id: '-1',
      maximumSelectionLength: 10,
      placeholder: "Chọn người chịu trách nhiệm",
      allowClear: true
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

  $scope.request = {
    ticket_code: '',
    service_id: '',
    channel: '',
    key_word: '',
    status: 1,
    level: '',
    assigned_id: '',
    responsible_id: '',
    start_date: '',
    end_date: '',
    user_id: $scope.user.id
  };

  $scope.request.status = ($scope.request.status).toString();

  $scope.totalRequest = 0;
  $scope.requestPerPage = 20;
  $scope.requestPerPages = 1000000;
  $scope.pagination = {
    current: 1
  };

  if(localStorageService.get('sessionParam') == 5){
    $scope.request.status = '';
  }

  $scope.requestPerPage = ($scope.requestPerPage).toString();

  $scope.pageChanged = function (newPage) {
    $scope.getRequest(newPage);
  };

  $scope.getRequest = function (pageNumber) {
    if($scope.request.assigned_id.length == 0){
      $scope.request.assigned_id = '';
    }

    if($scope.request.responsible_id.length == 0){
      $scope.request.responsible_id = '';
    }

    if($scope.request.start_date == null){
      $scope.request.start_date = '';
    }

    if($scope.request.end_date == null){
      $scope.request.end_date = '';
    }

    $scope.request['page'] = pageNumber || $scope.pagination.current;
    $scope.request['limit'] = $scope.requestPerPage;
    Request.one().one('get-all-request').get({
      page: $scope.request.page,
      limit: $scope.request.limit,
      ticket_code: $scope.request.ticket_code,
      service_id: $scope.request.service_id,
      channel: $scope.request.channel,
      key_word: $scope.request.key_word,
      level: $scope.request.level,
      status: $scope.request.status,
      assigned_id: $scope.request.assigned_id,
      responsible_id: $scope.request.responsible_id,
      start_date: $scope.request.start_date,
      end_date: $scope.request.end_date,
      user_id: $scope.request.user_id

    }).then(function (result) {
      $scope.requests = result.data;
      $scope.totalRequest = result.total;
      if (result.data.length < 1) {
        $scope.noData = 0;
      } else {
        $scope.noData = 1;
      }
    });
  };

  $scope.$watch('requestPerPage', function() {
    if($scope.requestPerPage) {
      $scope.getRequest(1);
    }
  });

  $scope.exportRequest = function () {
    if($scope.request.assigned_id.length == 0){
      $scope.request.assigned_id = '';
    }

    if($scope.request.responsible_id.length == 0){
      $scope.request.responsible_id = '';
    }

    if($scope.request.start_date == null){
      $scope.request.start_date = '';
    }

    if($scope.request.end_date == null){
      $scope.request.end_date = '';
    }

    $scope.request['limit'] = $scope.requestPerPages;

    $scope.request.user_id = $scope.user.id;
    var url = Request.one().one('export-all-request').getRestangularUrl();
    var str = jQuery.param($scope.request);
    var uri = url + '?' + str;

    window.open(uri, "_blank");

    return false;
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

    $scope.checkUser = function (id) {

      if ($scope.user.roleId == 10 || $scope.user.id == id) {
        return true;
      }
      return false;
    };

    $scope.checkUser_noadmin = function (id) {

      if ($scope.user.id == id) {
        return true;
      }
      return false;
    };
  });

  $scope.getService = function () {
    Service.one('get-all-service-no-paging').get().then(function (result) {
      $scope.services = result.data;
      $scope.services.id = parseInt(result.data.id);
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

  // $rootScope.$on("myCom", function () {
  //   $scope.getRequest(1);
  // });

  $scope.getService();
  $scope.getRightGroup();
  $scope.getRightGroupByManager();
});
