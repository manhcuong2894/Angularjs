+App.factory('ServiceConfig', function () {
  'use strict';

  var config = {
    serviceSLA: [
      {
        id: '1',
        value: '1',
        label: 'Ngày'
      },
      {
        id: '2',
        value: '2',
        label: 'Giờ'
      }
    ]
  };
  return config;
});
