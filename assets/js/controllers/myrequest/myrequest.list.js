+App.controller('MyRequestListCtrl', function ($scope, $state, Request, principal, Service, Right, localStorageService, RequestConfig) {

  var tmp = '';

  $scope.title = 'Quản lý yêu cầu của tôi';
  $scope.user = principal.getUser();

  $scope.statusSearchs = RequestConfig.requestStatus1;
  $scope.levelSearchs = RequestConfig.requestLevel;

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

  $scope.myrequest = {
    ticket_code: '',
    service_id: '',
    channel: '',
    key_word: '',
    level: '',
    status: '',
    user_id: $scope.user.id,
    start_date: '',
    end_date: ''
  };

  $scope.myrequest.status = ($scope.myrequest.status).toString();

  $scope.totalMyrequest = 0;
  $scope.myrequestPerPage = 20;
  $scope.myrequestPerPages = 10000;
  $scope.pagination = {
    current: 1
  };

  $scope.myrequestPerPage = ($scope.myrequestPerPage).toString();

  if (localStorageService.get('sessionParam') == 5) {
    $scope.myrequest.status = '';
  }

  $scope.pageChanged = function (newPage) {
    $scope.getMyRequest(newPage);
  };

  $scope.getMyRequest = function (pageNumber) {

    if ($scope.myrequest.start_date == null) {
      $scope.myrequest.start_date = '';
    }

    if ($scope.myrequest.end_date == null) {
      $scope.myrequest.end_date = '';
    }

    $scope.myrequest.page = pageNumber || $scope.pagination.current;
    $scope.myrequest.limit = $scope.myrequestPerPage;
    Request.one().one('get-all-request-of-me').get({
      page: $scope.myrequest.page,
      limit: $scope.myrequest.limit,
      ticket_code: $scope.myrequest.ticket_code,
      service_id: $scope.myrequest.service_id,
      channel: $scope.myrequest.channel,
      key_word: $scope.myrequest.key_word,
      level: $scope.myrequest.level,
      status: $scope.myrequest.status,
      start_date: $scope.myrequest.start_date,
      end_date: $scope.myrequest.end_date,
      user_id: $scope.myrequest.user_id
    }).then(function (result) {
      $scope.myrequests = result.data;
      $scope.totalMyrequest = result.total;

      if (result.total < 1) {
        $scope.noData = 0;
      } else {
        $scope.noData = 1;
      }
    });
  };

  $scope.exportMyRequest = function (pageNumber) {

    if ($scope.myrequest.start_date == null) {
      $scope.myrequest.start_date = '';
    }

    if ($scope.myrequest.end_date == null) {
      $scope.myrequest.end_date = '';
    }

    $scope.myrequest.page = pageNumber || $scope.pagination.current;
    $scope.myrequest.limit = $scope.myrequestPerPages;
    $scope.myrequest.user_id = $scope.user.id;
    var url = Request.one().one('export-all-request-of-me').getRestangularUrl();
    var str = jQuery.param($scope.myrequest);
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
      // console.log(id + ' / ' + $scope.user.id);
      if ($scope.user.id == id) {
        return true;
      }
      return false;
    };
  });

  $scope.$watch('myrequestPerPage', function () {
    if ($scope.myrequestPerPage) {
      $scope.getMyRequest(1);
    }
  });

  $scope.getService = function () {
    Service.one('get-all-service-no-paging').get().then(function (result) {
      $scope.services = result.data;
      $scope.services.id = parseInt(result.data.id);
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
});
