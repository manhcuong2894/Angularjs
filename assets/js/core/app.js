+(function(appName) {
  'use strict';
  window.App = angular.module(appName, [
    'ngAnimate',
    'ui.router',
    'restangular',
    'mgcrea.ngStrap',
    'satellizer',
    'ngMessages',
    'angularUtils.directives.dirPagination',
    'LocalStorageModule',
    'ngLoadingSpinner',
    'angularMoment',
    'toastr',
    'ngImageInputWithPreview',
    'ui.bootstrap'
  ]);
  App.value('config', window.appConfig);
  App.config(function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix(appName);
  });
})('helpdeskApp');
