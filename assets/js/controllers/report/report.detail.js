+App.controller('ReportDetailCtrl', function($scope, Report, Right, RequestConfig) {
  $scope.title = 'Báo cáo chi tiết';

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

  $scope.reportDetail = {
    handler_id: '',
    responsible_id: '',
    status: '',
    start_date: '',
    end_date: ''
  };

  $scope.totalReportDetail = 0;
  $scope.reportDetailPerPage = 10;
  $scope.reportDetailPerPages = 100000;
  $scope.pagination = {
    current: 1
  };

  $scope.statusSearchs = RequestConfig.requestStatus;

  $scope.pageChanged = function (newPage) {
    $scope.getReportDetail(newPage);
  };

  $scope.getReportDetail = function (pageNumber) {
    if($scope.reportDetail.handler_id.length == 0){
      $scope.reportDetail.handler_id = '';
    }

    if($scope.reportDetail.responsible_id.length == 0){
      $scope.reportDetail.responsible_id = '';
    }

    if($scope.reportDetail.start_date == null){
      $scope.reportDetail.start_date = '';
    }

    if($scope.reportDetail.end_date == null){
      $scope.reportDetail.end_date = '';
    }

    $scope.reportDetail['page'] = pageNumber || $scope.pagination.current;
    $scope.reportDetail['limit'] = $scope.reportDetailPerPage;
    Report.one('get-all-report-detail').get({
      page: $scope.reportDetail.page,
      limit: $scope.reportDetail.limit,
      handler_id: $scope.reportDetail.handler_id,
      responsible_id: $scope.reportDetail.responsible_id,
      status: $scope.reportDetail.status,
      start_date: $scope.reportDetail.start_date,
      end_date: $scope.reportDetail.end_date
    }).then(function (result) {
      $scope.reportDetails = result.data;
      $scope.totalReportDetail = result.total;
      if (result.data.length < 1) {
        $scope.noData = 0;
      } else {
        $scope.noData = 1;
      }
    });
  };

  $scope.exportReportDetail = function () {
    if($scope.reportDetail.handler_id.length == 0){
      $scope.reportDetail.handler_id = '';
    }

    if($scope.reportDetail.responsible_id.length == 0){
      $scope.reportDetail.responsible_id = '';
    }

    if($scope.reportDetail.start_date == null){
      $scope.reportDetail.start_date = '';
    }

    if($scope.reportDetail.end_date == null){
      $scope.reportDetail.end_date = '';
    }

    $scope.reportDetail['limit'] = $scope.reportDetailPerPage;

    var url = Report.one().one('export-report-detail').getRestangularUrl();
    var str = jQuery.param($scope.reportDetail);
    var uri = url + '?' + str;

    window.open(uri, "_blank");

    return false;
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

  $scope.getReportDetail();
  $scope.getRightGroup();
  $scope.getRightGroupByManager();
});
