+App.factory('RightConfig', function () {
  'use strict';

  var config = {
    rightStatus: [
      {
        id: '0',
        value: '0',
        label: 'Không hoạt động'
      },
      {
        id: '1',
        value: '1',
        label: 'Hoạt động'
      }
    ]
  };
  return config;
});