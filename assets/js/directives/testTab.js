+App.directive('tabHighlight', [function() {
    return {
      restrict: 'A',
      link: function(scope, element) {
        var x, y, initial_background = '#c3d5e6';

        element
          .removeAttr('style')
          .mousemove(function(e) {
            // Add highlight effect on inactive tabs
            if (!element.hasClass('active')) {
              x = e.pageX - this.offsetLeft;
              y = e.pageY - this.offsetTop;

              element
                .css({
                  background: '-moz-radial-gradient(circle at ' + x + 'px ' + y + 'px, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.0) 45px), ' + initial_background
                })
                .css({
                  background: '-webkit-radial-gradient(circle at ' + x + 'px ' + y + 'px, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.0) 45px), ' + initial_background
                })
                .css({
                  background: 'radial-gradient(circle at ' + x + 'px ' + y + 'px, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.0) 45px), ' + initial_background
                });
            }
          })
          .mouseout(function() {
            element.removeAttr('style');
          });
      }
    };
  }]);