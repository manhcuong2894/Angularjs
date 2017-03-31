+App.controller('ReportGeneralCtrl', function($scope, Report, Right) {
  $scope.title = 'Báo cáo tổng hợp';

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

  $scope.reportGeneral = {
    start_date: '',
    end_date: '',
    handler_group_id: ''
  };

  $scope.getReportGeneral = function () {
    if($scope.reportGeneral.handler_group_id.length == 0){
      $scope.reportGeneral.handler_group_id = '';
    }

    if($scope.reportGeneral.start_date == null){
      $scope.reportGeneral.start_date = '';
    }

    if($scope.reportGeneral.end_date == null){
      $scope.reportGeneral.end_date = '';
    }

    Report.one('get-all-report-general').get({
      start_date: $scope.reportGeneral.start_date,
      end_date: $scope.reportGeneral.end_date,
      handler_group_id: $scope.reportGeneral.handler_group_id
    }).then(function (result) {
      $scope.reportGenerals = result.data;
      if (result.data.length < 2) {
        $scope.noData = 0;
      } else {
        $scope.noData = 1;
      }
    });
  };

  $scope.exportReportGeneral = function () {

    if($scope.reportGeneral.handler_group_id.length == 0){
      $scope.reportGeneral.handler_group_id = '';
    }

    if($scope.reportGeneral.start_date == null){
      $scope.reportGeneral.start_date = '';
    }

    if($scope.reportGeneral.end_date == null){
      $scope.reportGeneral.end_date = '';
    }

    var url = Report.one().one('export-report-general').getRestangularUrl();
    var str = jQuery.param($scope.reportGeneral);
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
  $scope.getReportGeneral();
});
