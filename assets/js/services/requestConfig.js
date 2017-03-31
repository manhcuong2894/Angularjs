+App.factory('RequestConfig', function () {
  'use strict';

  var config = {
    requestStatus: [
      {
        id: '1',
        value: '1',
        label: 'Open'
      },
      {
        id: '2',
        value: '2',
        label: 'Update'
      },
      {
        id: '3',
        value: '3',
        label: 'Pending'
      },
      {
        id: '4',
        value: '4',
        label: 'Reopen'
      },
      {
        id: '5',
        value: '5',
        label: 'Close'
      },
      {
        id: '6',
        value: '6',
        label: 'Delete'
      }
    ],

    requestStatus1: [
      {
        id: '1',
        value: '1',
        label: 'Open'
      },
      {
        id: '3',
        value: '3',
        label: 'Pending'
      },
      {
        id: '4',
        value: '4',
        label: 'Reopen'
      },
      {
        id: '5',
        value: '5',
        label: 'Close'
      }
    ],

    requestLevel: [
      {
        id: '0',
        value: '0',
        label: 'Bình thường'
      },
      {
        id: '1',
        value: '1',
        label: 'Gấp'
      },
      {
        id: '2',
        value: '2',
        label: 'Rất gấp'
      }
    ],

    channelLabel: [
      {
        id: '1',
        value: '1',
        label: 'Điện thoại'
      },
      {
        id: '2',
        value: '2',
        label: 'Email'
      }
    ]
  };
  return config;
});
