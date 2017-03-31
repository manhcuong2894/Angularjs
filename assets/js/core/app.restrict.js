+App.run(['$rootScope', '$state', '$stateParams', 'authorization', 'principal', 'Restangular', 'RestangularConfig', 'Portal', 'toastr',
  function ($rootScope, $state, $stateParams, authorization, principal, Restangular, RestangularConfig, Portal, toastr) {

    console.log('App run............!');

    //Initial Restangular
    Restangular.setBaseUrl(Portal.getPortal().api);
    // End

    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
      // track the state the user wants to go to; authorization service needs this
      $rootScope.returnToState = toState;
      $rootScope.returnToStateParams = toStateParams;
    });

    Restangular.setErrorInterceptor(function(response, deferred, responseHandler) {
      if(response.status === 401 && response.data.code == 'E_UNAUTHORIZED') {
        return restrict();
      }

      function restrict() {
        if($state.current.name != 'login') {
          $rootScope.returnToState = $state;
          $rootScope.returnToStateParams = $stateParams;
          authorization.logout();
          $state.go('login');
          // toastr.warning('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.', 'Thông báo!');
        }
        return false; // error handled
      }

      return true; // error not handled
    })
  }
]);
