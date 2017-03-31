+App.factory('authorization', ['$rootScope', '$state', 'principal',
  function($rootScope, $state, principal) {

    // from here: http://stackoverflow.com/questions/22537311/angular-ui-router-login-authentication

    return {
      authorize: function() {
        return principal.identity()
          .then(function() {
            var isAuthenticated = principal.isAuthenticated();

            if ($rootScope.toState && $rootScope.toState.data) {
              if (isAuthenticated) {
                $state.go('accessdenied'); // user is signed in but not authorized for desired state
                //  if (isAuthenticated || $state == 'login') {
                //do nothing
              } else {
                // user is not authenticated. stow the state they wanted before you
                // send them to the signin state, so you can return them when you're done

                if(!$rootScope.returnToState) {
                  $rootScope.returnToState = $rootScope.toState;
                  $rootScope.returnToStateParams = $rootScope.toStateParams;
                }

                // now, send them to the signin state so they can log in
                $state.go('login');
              }
            }
          });
      },
      logout: function() {
        principal.removeIdentity();
      }
    };
  }
]);
