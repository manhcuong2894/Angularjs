+App.directive('cancelButton', function($window) {
  return {
    restrict: 'ACE',
    template: '<a href="javascript:;" ng-click="back()" class="btn btn-danger mg-left-20px">Hủy bỏ</a>',
    link: function($scope) {
      $scope.back = function() {
        $window.history.back();
      }
    }
  }
});
