+App.controller('AuthLogoutCtrl', function($scope, $state, authorization) {
  authorization.logout();
  $state.go('login');
  console.log('You have been logged out');
});
