+App.config(function($stateProvider, $urlRouterProvider, $qProvider) {
  'use strict';

  $urlRouterProvider.otherwise('/auth/changepassword');
  $qProvider.errorOnUnhandledRejections(false);

  $stateProvider.state('login', {
    url: '/login',
    views: {
      '@': {
        controller: 'AuthLoginCtrl',
        templateUrl: 'templates/auth.login.html'
      }
    },
    resolve: {
      loginRequired: skipIfLoggedIn
    }
  });

  $stateProvider.state('site', {
    abstract: true,
    resolve: {
      authorize: ['authorization',
        function(authorization) {
          return authorization.authorize();
        }
      ],
      loginRequired: loginRequired
    },

    views: {
      "@": {
        controller: 'SiteCtrl',
        templateUrl: 'templates/layouts/site.html'
      }
    }
  });

  lazyRouteParser({
    'home': {
      url: '/',
      resolve: {
        loginRequired: loginRequired
      }
    },

    'contact': {
      url: '/contact',
      resolve: {
        loginRequired: loginRequired
      }
    },

    'accessdenied': {
      url: '/accessdenied',
      views: {
        '@site': {
          templateUrl: 'templates/accessdenied.html'
        }
      }
    },

    /*-----auth-----*/
    'auth': {
      abstract: true,
      url: '/auth',
      resolve: {
        loginRequired: loginRequired
      }
    },
    'auth.changepassword': {
      url: '/changepassword',
      resolve: {
        loginRequired: loginRequired
      }
    },
    'auth.profile': {
      url: '/profile',
      resolve: {
        loginRequired: loginRequired
      }
    },
    'auth.logout': {
      url: '/logout'
    },

    /*-----Account-----*/
    'account': {
      abstract: true,
      url: '/account',
      resolve: {
        loginRequired: loginRequired
      }
    },
    'account.list': {
      url: '/list',
      resolve: {
        loginRequired: loginRequired
      }
    },
    'account.add': {
      url: '/add',
      resolve: {
        loginRequired: loginRequired
      }
    },
    'account.edit': {
      url: '/edit/:id',
      resolve: {
        loginRequired: loginRequired
      }
    },
    'account.reset': {
      url: '/reset/:id',
      resolve: {
        loginRequired: loginRequired
      }
    },
    'account.delete': {
      url: '/delete/:id',
      resolve: {
        loginRequired: loginRequired
      }
    },

    /*-----Right-----*/
    'right': {
      abstract: true,
      url: '/right',
      resolve: {
        loginRequired: loginRequired
      }
    },
    'right.list': {
      url: '/list',
      resolve: {
        loginRequired: loginRequired
      }
    },
    'right.add': {
      url: '/add',
      resolve: {
        loginRequired: loginRequired
      }
    },
    'right.edit': {
      url: '/edit/:id',
      resolve: {
        loginRequired: loginRequired
      }
    },
    'right.detail': {
      url: '/detail/:id',
      resolve: {
        loginRequired: loginRequired
      }
    },
    'right.delete': {
      url: '/delete/:id',
      resolve: {
        loginRequired: loginRequired
      }
    },

    /*-----service-----*/
    'service': {
      abstract: true,
      url: '/service',
      resolve: {
        loginRequired: loginRequired
      }
    },
    'service.list': {
      url: '/list',
      resolve: {
        loginRequired: loginRequired
      }
    },
    'service.detail': {
      url: '/detail',
      resolve: {
        loginRequired: loginRequired
      }
    },
    'service.add': {
      url: '/add',
      resolve: {
        loginRequired: loginRequired
      }
    },
    'service.edit': {
      url: '/edit/:id',
      resolve: {
        loginRequired: loginRequired
      }
    },

    /*-----document-----*/
    'document': {
      abstract: true,
      url: '/document',
      resolve: {
        loginRequired: loginRequired
      }
    },
    'document.list': {
      url: '/list',
      resolve: {
        loginRequired: loginRequired
      }
    },
    'document.add': {
      url: '/add',
      resolve: {
        loginRequired: loginRequired
      }
    },

    /*-----Request-----*/
    'request': {
      abstract: true,
      url: '/request',
      resolve: {
        loginRequired: loginRequired
      }
    },
    'request.list': {
      url: '/list',
      resolve: {
        loginRequired: loginRequired
      }
    },

    'request.add': {
      url: '/add',
      resolve: {
        loginRequired: loginRequired
      }
    },

    'request.edit': {
      url: '/edit/:id',
      resolve: {
        loginRequired: loginRequired
      }
    },

    'request.delete': {
      url: '/delete/:id',
      resolve: {
        loginRequired: loginRequired
      }
    },

    'request.detail': {
      url: '/detail/:id',
      resolve: {
        loginRequired: loginRequired
      }
    },

    'request.check': {
      url: '/check/:id',
      resolve: {
        loginRequired: loginRequired
      }
    },

    'request.reopen': {
      url: '/reopen/:id',
      resolve: {
        loginRequired: loginRequired
      }
    },

    'request.history': {
      url: '/history',
      resolve: {
        loginRequired: loginRequired
      }
    },

    /*-----MyRequest-----*/
    'myRequest': {
      abstract: true,
      url: '/myRequest',
      resolve: {
        loginRequired: loginRequired
      }
    },
    'myRequest.list': {
      url: '/list',
      resolve: {
        loginRequired: loginRequired
      }
    },

    /*-----Report-----*/
    'report': {
      abstract: true,
      url: '/report',
      resolve: {
        loginRequired: loginRequired
      }
    },
    'report.detail': {
      url: '/detail',
      resolve: {
        loginRequired: loginRequired
      }
    },
    'report.general': {
      url: '/general',
      resolve: {
        loginRequired: loginRequired
      }
    },
    'report.requestoutofdate': {
      url: '/request-out-of-date',
      resolve: {
        loginRequired: loginRequired
      }
    },
    'report.requestnothandling': {
      url: '/request-not-handling',
      resolve: {
        loginRequired: loginRequired
      }
    },
    //test
    'test': {
      abstract: true,
      url: '/test',
      resolve: {
        loginRequired: loginRequired
      }
    },
    'test.tab': {
      url: '/test-tab',
      resolve: {
        loginRequired: loginRequired
      }
    }
  });

  function loginRequired($location) {
    if(localStorage.getItem('tokenSub') == null || localStorage.getItem('tokenSub') == ''){
      $location.path('/login');
    }
  }

  function skipIfLoggedIn($location) {
    if(localStorage.getItem('tokenSub') != null || localStorage.getItem('tokenSub') != ''){
      $location.path('/auth/changepassword');
    }
  }

  // use the HTML5 History API
  // $locationProvider.html5Mode(false);

  /**
   * @description
   * Why called lazy?
   * Actually, the router isn't lazy at all,
   * but the developer is, pretty lazy, I would say.
   * So we have the naming-convention for the correspondence
   * between state-controller-view, it's a good idea to
   * let the machine auto-parse it by itself.
   * Why would we wanna repeat ourselves?
   */
  function lazyRouteParser(routes) {
    angular.forEach(routes, function(stateConfig, state) {
      var parentState = state.replace(/(^|\.)[^.]+$/, '')
        , templateUrl = 'templates/' + state + '.html'
        , controller = state.replace(/(^|\.|-)(.)/g, function() {
          return arguments[2].toUpperCase()
        }) + 'Ctrl';

      //console.log(parentState, templateUrl, controller)
      //console.log(stateConfig);

      parentState = parentState || 'site';

      var defaultStateConfig = { views: {} };
      defaultStateConfig['parent'] = parentState;
      defaultStateConfig['url'] = '^/' + state;
      defaultStateConfig['views']['@' + parentState] = {
        templateUrl: templateUrl,
        controller: controller,
        controllerAs: controller
      };
      defaultStateConfig['title'] = state
        .replace(/\b(out|in|single)\b|\.|-/g, ' ') // Stripping stop words
        .replace(/^\s+|\s+$/g, '') // Trim, ofcourse
        .replace(/\b(.)/g, function() {
          return arguments[0].toUpperCase();
        })
        .toUpperCase();

      // A single state require an :id suffix in URL,
      //   and doesn't extend from its parent view
      //   but its parent-of-parent view, yep.
      if(/\.single$/.test(state)) {
        defaultStateConfig['url'] = defaultStateConfig['url'] + '/:id';

        defaultStateConfig['views']['@' + parentState.replace(/\.[^.]+$/, '')] = defaultStateConfig['views']['@' + parentState];
        delete defaultStateConfig['views']['@' + parentState];
      }

      $stateProvider.state(
        state,
        angular.copy(
          angular.extend(
            defaultStateConfig,
            stateConfig
          ),
          stateConfig
        )
      );

      return null;
    });
  }
});
