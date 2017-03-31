+App.controller('ReportRequestnothandlingCtrl', function($scope, Report, Right, YearConfig) {
  $scope.title = 'Báo cáo các yêu cầu chưa được xử lý';

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

  $scope.years = YearConfig.year;
  var curYear = new Date().getFullYear();
  var arrLastYear = YearConfig.year.length - 1;

  $scope.reportNoHandling = {
    handler_group_id: '',
    year_request: curYear
  };

  $scope.reportNoHandling.year_request = YearConfig.year[arrLastYear].id;

  $scope.getReportNoHandling = function () {
    if($scope.reportNoHandling.handler_group_id.length == 0){
      $scope.reportNoHandling.handler_group_id = '';
    }

    Report.one('get-all-report-request-no-handling').get({
      handler_group_id: $scope.reportNoHandling.handler_group_id,
      year_request: $scope.reportNoHandling.year_request
    }).then(function (result) {
      $scope.reportNoHands = result.data;
      if (result.data.length < 2) {
        $scope.noData = 0;
      } else {
        $scope.noData = 1;
      }
    });
  };

  $scope.exportReportNoHandling = function () {

    if($scope.reportNoHandling.handler_group_id.length == 0){
      $scope.reportNoHandling.handler_group_id = '';
    }

    var url = Report.one().one('export-report-request-no-handling').getRestangularUrl();
    var str = jQuery.param($scope.reportNoHandling);
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
  $scope.getReportNoHandling();
});
