+App.service('Portal', ['$q', 'Restangular', 'localStorageService', 'RestangularConfig',
  function($q, Restangular, localStorageService, RestangularConfig) {
    var _config = [
      {
        id: 1,
        name: 'helpdesk',
        title: 'Hệ thống quản lý yêu cầu',
        api: 'http://localhost:1337',
        // api: 'http://edumobile.vn:8087',
        theme: 'helpdesk'
      }
    ];

    var _portal = undefined;
    return {
      getPortal: function() {
        var p;
        if(_portal) {
          p = _portal;
        } else {
          p = localStorageService.get('portal');
        }
        return p || _config[0];
      },
      setPortal: function(portal) {
        _portal = portal;

        RestangularConfig.setBaseUrl(_portal.api);
        localStorageService.set('portal', _portal);
      },
      config: _config
    }
  }]);
