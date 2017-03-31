+App.controller('RightAddCtrl', function($scope, $state, toastr, Restangular, principal) {
	$scope.title = 'Thêm mới nhóm quyền';
	var user = principal.getUser();

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
		description: '',
		groupName: '',
		status: 1,
		createBy: user.username
	};

	$scope.rightgroups1 = [
		{
    	title: 'Quản lý yêu cầu',
    	features: [
        {id: 2, text: 'Danh sách yêu cầu'},
        {id: 3, text: 'Thêm mới yêu cầu'},
        {id: 4, text: 'Cập nhật yêu cầu'},
        {id: 5, text: 'Xóa yêu cầu'},
        {id: 6, text: 'Chi tiết yêu cầu'},
        {id: 7, text: 'Xử lý yêu cầu'},
        {id: 8, text: 'Mở lại yêu cầu'},
        {id: 9, text: 'Lịch sử yêu cầu'}
    	]
  	}
	];

	$scope.rightgroups10 = [
   	{
	    title: 'Quàn lý tài liệu',
	    features: [
        {id: 11, text: 'Danh sách tài liệu'},
        {id: 12, text: 'Thêm mới tài liệu'}
      ]
  	}
	];

	$scope.rightgroups13 = [
    {
    	title: 'Báo cáo',
    	features: [
        {id: 33, text: 'Báo cáo chi tiết'},
        {id: 14, text: 'Báo cáo tổng hợp'},
        {id: 15, text: 'Báo cáo các yêu cầu'},
        {id: 16, text: 'Báo cáo yêu cầu chưa xử lý'}
      ]
    }
	];

  $scope.rightgroups17 =  [
  	{
    	title: 'Quản lý DS tài khoản',
      features: [
        {id: 18, text: 'Danh sách'},
        {id: 19, text: 'Thêm mới'},
        {id: 20, text: 'Cập nhật'},
        {id: 21, text: 'Xóa'},
        {id: 22, text: 'Reset mật khẩu'}
      ]
    }
	];

	$scope.rightgroups23 =  [
    {
      title: 'Quản lý phân quyền',
      features: [
        {id: 24, text: 'Danh sách'},
        {id: 25, text: 'Thêm mới'},
        {id: 26, text: 'Cập nhật'},
        {id: 27, text: 'Xóa'},
        {id: 28, text: 'Xem chi tiết'}
      ]
    }
	];

	$scope.rightgroups29 =  [
		{
      title: 'Quản lý dịch vụ',
      features: [
        {id: 30, text: 'Danh sách'},
        {id: 31, text: 'Thêm mới'},
        {id: 32, text: 'Cập nhật'}
      ]
    }
	];

  $scope.selected1 = {};
  $scope.selected10 = {};
  $scope.selected13 = {};
  $scope.selected17 = {};
  $scope.selected23 = {};
  $scope.selected29 = {};

	$scope.selectAll1 = function(){
    var featuresArr1 = $scope.rightgroups1[0].features;
	  for (var i = 0; i < featuresArr1.length; i++) {
	    var item = featuresArr1[i];
	    $scope.selected1[item.id] = $scope.checkedRequest;
		}
	};

	$scope.selectAll10= function(){
		var featuresArr = $scope.rightgroups10[0].features;
	  for (var i = 0; i < featuresArr.length; i++) {
	    var item = featuresArr[i];
	    $scope.selected10[item.id] = $scope.checkedDocument;
		}
	};

	$scope.selectAll13 = function(){
		var featuresArr = $scope.rightgroups13[0].features;
	  for (var i = 0; i < featuresArr.length; i++) {
	    var item = featuresArr[i];
	    $scope.selected13[item.id] = $scope.checkedReport;
		}
	};

	$scope.selectAll17 = function(){
		var featuresArr = $scope.rightgroups17[0].features;
	  for (var i = 0; i < featuresArr.length; i++) {
	    var item = featuresArr[i];
	    $scope.selected17[item.id] = $scope.checkedAccount;
		}
	};

	$scope.selectAll23 = function(){
		var featuresArr = $scope.rightgroups23[0].features;
	  for (var i = 0; i < featuresArr.length; i++) {
	    var item = featuresArr[i];
	    $scope.selected23[item.id] = $scope.checkedRight;
		}
	};

	$scope.selectAll29 = function(){
		var featuresArr = $scope.rightgroups29[0].features;
	  for (var i = 0; i < featuresArr.length; i++) {
	    var item = featuresArr[i];
	    $scope.selected29[item.id] = $scope.checkedService;
		}
	};

	var tmpArr = [];
	$scope.save = function () {
    tmpArr = [];
    getID($scope.selected1);
    getID($scope.selected10);
    getID($scope.selected13);
    getID($scope.selected17);
    getID($scope.selected23);
    getID($scope.selected29);

    if ($scope.rightAddForm.$invalid) {
      angular.forEach($scope.rightAddForm.$error, function (field) {
        angular.forEach(field, function (errorField) {
          errorField.$setTouched();
        })
      });
      return;
    }

    $scope.right.features = tmpArr;

    if(($scope.right.features).length == 0) {
      toastr.error('Vui lòng chọn ít nhất 1 quyền', 'Lỗi!');
      return false;
    }
    console.log('features: ' + ($scope.right.features));
    Restangular.all('right/add-new-right-group').post($scope.right).then(function (data) {
      toastr.success('Thêm mới thành công', 'Thông báo!');
      $state.go('right.list');
    }, function (err) {
      if(err.data.status == 5){
        toastr.error('Tên nhóm quyền đã tồn tại, vui lòng kiểm tra lại!', 'Lỗi!');
      }else {
        toastr.error('Thêm mới không thành công!', 'Lỗi!');
      }
    });
    return false;
	};

	function getID(tmScope){
    for(var k in tmScope){
      if(k != null && tmScope[k] == true){
        tmpArr.push(parseInt(k));
      }
    }
	}

});
