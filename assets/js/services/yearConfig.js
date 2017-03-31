+App.factory('YearConfig', function () {
  'use strict';

  var config = {
    year: []
  };

  var curYear = new Date().getFullYear();

  for (var i = 1970; i <= curYear; i++) {
    config.year.push({
      id: i,
      label: i
    });
  }

  return config;
});
