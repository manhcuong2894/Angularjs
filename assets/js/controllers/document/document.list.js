+App.controller('DocumentListCtrl', function ($scope, $state, Document, Service, toastr, principal) {

  $scope.title = 'Quản lý tài liệu';
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

  $scope.document = {
    file_name: '',
    service_id: '',
    start_date: '',
    end_date: ''
  };

  $scope.totalDocument = 0;
  $scope.documentPerPage = 20;
  $scope.pagination = {
    current: 1
  };

  $scope.documentPerPage = ($scope.documentPerPage).toString();

  $scope.pageChanged = function (newPage) {
    $scope.getDocument(newPage);
  };

  $scope.getDocument = function (pageNumber) {
    if ($scope.document.start_date == null) {
      $scope.document.start_date = '';
    }

    if ($scope.document.end_date == null) {
      $scope.document.end_date = '';
    }

    $scope.document['page'] = pageNumber || $scope.pagination.current;
    $scope.document['limit'] = $scope.documentPerPage;
    Document.one().one('get-all-document').get({
      page: $scope.document.page,
      limit: $scope.document.limit,
      file_name: $scope.document.file_name,
      service_id: $scope.document.service_id,
      start_date: $scope.document.start_date,
      end_date: $scope.document.end_date
    }).then(function (result) {
      console.log(result.data);
      $scope.documents = result.data;

      $scope.totalDocument = result.total;
      if (result.data.length < 1) {
        $scope.noData = 0;
      } else {
        $scope.noData = 1;
      }
    });
  };

  $scope.checkUser = function (id) {
    if ($scope.user.roleId == 10 || $scope.user.id == id) {
      return true;
    }
    return false;
  };

  $scope.getService = function () {
    Service.one('get-all-service-no-paging').get().then(function (result) {
      $scope.services = result.data;
      $scope.services.id = parseInt(result.data.id);
    });
  };


  $scope.download = function (id) {
    Document.one().one('download-document').get({id: id}).then(function (result) {
      var url = Document.one().one('download-document').getRestangularUrl();
      var str = jQuery.param({id: id});
      var uri = url + '?' + str;

      window.open(uri, "_blank");

      return false;
    });
  };

  $scope.getInfo = function (id) {
    $scope.idDoccument = id;
  };

  $scope.delete = function (id) {
    Document.one().one('delete-document').remove({id: id}).then(function (result) {
      $('#confirm_account').modal('hide');
      toastr.success('Xóa thành công', 'Thông báo!');
      $scope.getDocument();
    }, function (err) {
      $('#confirm_account').modal('hide');
      toastr.error('Xóa không thành công', 'Lỗi!');
    });
  };

  $scope.$watch('documentPerPage', function () {
    if ($scope.documentPerPage) {
      $scope.getDocument(1);
    }
  });

  $scope.getService();
  $scope.getDocument();
});
