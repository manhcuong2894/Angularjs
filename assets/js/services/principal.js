+App.factory('principal', ['$q', '$http', '$timeout', 'Restangular', 'localStorageService', 'RestangularConfig',
  function ($q, $http, $timeout, Restangular, localStorageService, RestangularConfig) {
    var _identity = undefined
      , _authenticated = false
      , _token = undefined
      ;

    return {
      getToken: function () {
        return _token;
      },
      setToken: function (token) {
        _token = token;
        RestangularConfig.setToken(_token);
      },
      getUser: function () {
        return _identity;
      },
      setUser: function (identity) {
        _identity = identity;
      },
      isIdentityResolved: function () {
        return angular.isDefined(_identity);
      },
      isAuthenticated: function () {
        return _authenticated;
      },
      authenticate: function (info) {
        var _self = this;
        var deferred = $q.defer();
        Restangular.all('auth/login').post(info).then(function (res) {
          console.log('token: ' + res.token);
          var token = res.token;
          var dres = token.split('.');
          var resObj = JSON.parse(urlBase64Decode(dres[1]));
          console.log(resObj);
          var user = {
            id: resObj.user.id,
            username: resObj.user.username,
            fullName: resObj.user.fullName,
            email: resObj.user.email,
            phoneNumber: resObj.user.phoneNumber,
            status: resObj.user.status,
            roleId: resObj.user.roleId,
            createAt: resObj.user.createAt,
            editedAt: resObj.user.editedAt,
            createBy: resObj.user.createBy,
            editedBy: resObj.user.editedBy,
            manager: resObj.user.manager,
            avatar: resObj.user.avatar
          };


          _self.setToken(res.token);
          _self.setUser(user);
          _authenticated = true;

          localStorageService.set('user', _identity);
          localStorageService.set('token', _token);

          localStorage.setItem('tokenSub', res.token);

          deferred.resolve(_identity);
        }, function (err) {
          deferred.reject(err);
        });

        function urlBase64Decode(str) {
          var output = str.replace('-', '+').replace('_', '/');
          switch (output.length % 4) {
            case 0:
              break;
            case 2:
              output += '==';
              break;
            case 3:
              output += '=';
              break;
            default:
              throw 'Illegal base64url string!';
          }
          return decodeURIComponent(escape(window.atob(output)));
        }

        return deferred.promise;
      },

      identity: function (force) {
        var deferred = $q.defer();

        if (force === true) {
          this.setUser(null);
        }

        // check and see if we have retrieved the identity data from the server. if we have, reuse it by immediately resolving
        if (angular.isDefined(_identity)) {
          deferred.resolve(_identity);

          return deferred.promise;
        } else {
          //get from localstorage
          var localToken = localStorageService.get('token');
          var localUser = localStorageService.get('user');
          if (localToken && localUser) {
            this.setToken(localToken);
            _authenticated = true;
            deferred.resolve(_identity = localUser);
          }
        }

        var self = this;
        $timeout(function () {
          //self.authenticate(null);
          deferred.resolve(_identity);
        }, 200);


        return deferred.promise;
      },

      removeIdentity: function () {
        localStorageService.remove('user', 'token');
        localStorage.removeItem('tokenSub', 'idUser', 'username');

        _token = null;
        _identity = null;
        _authenticated = false;
      }
    };
  }
]);
