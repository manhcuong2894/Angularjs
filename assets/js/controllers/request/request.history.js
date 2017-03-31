+App.controller('RequestHistoryCtrl', function($scope, RequestConfig, Request, Right) {

  $scope.title = 'Quản lý yêu cầu';
  $scope.statusSearchs = RequestConfig.requestStatus;

  $(document).ready(function() {
    $(".select2_multiple").select2({
      id: '-1',
      maximumSelectionLength: 10,
      placeholder: "Chọn người xử lý",
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

  $scope.totalHistoryRequest = 0;
  $scope.historyRequestPerPage = 20;
  $scope.pagination = {
    current: 1
  };

  $scope.historyRequestPerPage = ($scope.historyRequestPerPage).toString();

  $scope.historyRequest = {
    ticket_code: '',
    key_word: '',
    handler_id: '',
    status: '',
    start_date: '',
    end_date: ''
  };

  $scope.pageChanged = function (newPage) {
    $scope.getHistoryRequest(newPage);
  };

  $scope.getHistoryRequest = function (pageNumber) {
    if($scope.historyRequest.handler_id.length == 0){
      $scope.historyRequest.handler_id = '';
    }

    if($scope.historyRequest.start_date == null){
      $scope.historyRequest.start_date = '';
    }

    if($scope.historyRequest.end_date == null){
      $scope.historyRequest.end_date = '';
    }

    $scope.historyRequest['page'] = pageNumber || $scope.pagination.current;
    $scope.historyRequest['limit'] = $scope.historyRequestPerPage;
    Request.one().one('list-history-request').get({
      page: $scope.historyRequest.page,
      limit: $scope.historyRequest.limit,
      ticket_code: $scope.historyRequest.ticket_code,
      key_word: $scope.historyRequest.key_word,
      handler_id: $scope.historyRequest.handler_id,
      status: $scope.historyRequest.status,
      start_date: $scope.historyRequest.start_date,
      end_date: $scope.historyRequest.end_date
    }).then(function (result) {
      $scope.historyRequests = result.data;
      $scope.totalHistoryRequest = result.total;
      if (result.data.length < 1) {
        $scope.noData = 0;
      } else {
        $scope.noData = 1;
      }
    });
  };

  $scope.$watch('historyRequestPerPage', function() {
    if($scope.historyRequestPerPage) {
      console.log('aaa');
      $scope.getHistoryRequest(1);
    }
  });

  $scope.getRightGroup = function () {
    Right.one('get-right-group-select').get().then(function (result) {
      $scope.rightGroups = result.data;
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

  $scope.getRightGroup();
});
