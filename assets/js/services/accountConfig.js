+App.factory('AccountConfig', function () {
  'use strict';

  var config = {
    accountStatus: [
      {
        id: '1',
        value: '1',
        label: 'Hoạt động'
      },
      {
        id: '0',
        value: '0',
        label: 'Ngừng hoạt động'
      }
    ],

    accountManager: [
      {
        id: '1',
        value: '1',
        label: 'Quản lý'
      },
      {
        id: '0',
        value: '0',
        label: 'Nhân viên'
      }
    ]
  };
  return config;
});
