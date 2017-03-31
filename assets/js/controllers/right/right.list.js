+App.controller('RightListCtrl', function($scope, Right, principal) {

	$scope.title = 'Quản lý nhóm quyền';
  $scope.user = principal.getUser();

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

	$scope.right = {
		group_name: ''
	};

	$scope.totalRight = 0;
  $scope.rightPerPage = 10;
  $scope.pagination = {
    current: 1
  };

  $scope.pageChanged = function (newPage) {
    $scope.getRight(newPage);
  };

  $scope.getRight = function (pageNumber) {
    $scope.right['page'] = pageNumber || $scope.pagination.current;
    $scope.right['limit'] = $scope.rightPerPage;
    Right.one().one('search-right-group-by-name').get({
      page: $scope.right.page,
      limit: $scope.right.limit,
      group_name: $scope.right.group_name
    }).then(function (result) {
      $scope.rights = result.data;
      $scope.totalRight = result.total;
      if (result.data.length < 1) {
        $scope.noData = 0;
      } else {
        $scope.noData = 1;
      }
    });
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
  });

  $scope.getRight();

});
