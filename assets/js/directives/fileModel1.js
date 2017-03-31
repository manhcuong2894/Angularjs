+App.directive('fileModel1', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      var model = $parse(attrs.fileModel1);
      var modelSetter = model.assign;

      ngModel.$render = function () {
        ngModel.$setViewValue(element.val());
      };

      element.bind('change', function(){
        scope.$apply(function(){
          ngModel.$render();
          modelSetter(scope, element[0].files[0]);
          console.log(element[0]);
        });
      });
    }
  };
}]);
