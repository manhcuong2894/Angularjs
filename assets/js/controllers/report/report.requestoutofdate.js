+App.controller('ReportRequestoutofdateCtrl', function($scope, Report, Right) {
  $scope.title = 'Báo cáo các yêu cầu quá hạn';

  $(document).ready(function() {
    $(".select2_multiple").select2({
      id: '-1',
      maximumSelectionLength: 10,
      placeholder: "Chọn nhóm xử lý",
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

  $scope.reportOutOfDate = {
    start_date: '',
    end_date: '',
    handler_group_id: ''
  };

  $scope.getReportOutOfDate = function () {
    if($scope.reportOutOfDate.handler_group_id.length == 0){
      $scope.reportOutOfDate.handler_group_id = '';
    }

    if($scope.reportOutOfDate.start_date == null){
      $scope.reportOutOfDate.start_date = '';
    }

    if($scope.reportOutOfDate.end_date == null){
      $scope.reportOutOfDate.end_date = '';
    }

    Report.one('get-all-report-request-out-of-date').get({
      start_date: $scope.reportOutOfDate.start_date,
      end_date: $scope.reportOutOfDate.end_date,
      handler_group_id: $scope.reportOutOfDate.handler_group_id
    }).then(function (result) {
      $scope.reportOuts = result.data;
      if (result.data.length < 2) {
        $scope.noData = 0;
      } else {
        $scope.noData = 1;
      }
    });
  };

  $scope.exportReportOutOfDate = function () {

    if($scope.reportOutOfDate.handler_group_id.length == 0){
      $scope.reportOutOfDate.handler_group_id = '';
    }

    if($scope.reportOutOfDate.start_date == null){
      $scope.reportOutOfDate.start_date = '';
    }

    if($scope.reportOutOfDate.end_date == null){
      $scope.reportOutOfDate.end_date = '';
    }

    var url = Report.one().one('export-report-request-out-of-date').getRestangularUrl();
    var str = jQuery.param($scope.reportOutOfDate);
    var uri = url + '?' + str;

    window.open(uri, "_blank");

    return false;
  };

  $scope.getRightGroup = function () {
    Right.one('get-right-group-select').get().then(function (result) {
      $scope.rightGroups = result.data;
    });
  };

  $scope.getRightGroup();
  $scope.getReportOutOfDate();
});
