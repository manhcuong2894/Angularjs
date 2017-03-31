+App.controller('SiteCtrl', function ($scope, $state, principal, Right, Request) {

  $scope.user = principal.getUser();
  var tmp = '';

  $scope.iframeHeight = window.innerHeight;

  if (localStorage.getItem('tokenSub') == null || localStorage.getItem('tokenSub') == '') {
    $state.go('login');
  }else {
    if($scope.user.avatar != null && $scope.user.avatar != ''){
      $scope.avatar = $scope.user.avatar;
    }

    Right.one('get-right-group-by-id-for-permission').get({id: $scope.user.roleId}).then(function (result) {
      tmp = result.data[0].features;
      $scope.checkRight = function (id) {
        if ($scope.user.roleId == 10) {
          return true;
        }
        for (var i = 0; i < tmp.length; i++) {
          if (tmp[i].id == id) {
            return true;
          }
        }
        return false;
      };
    });

    Request.one().one('get-all-request-of-me').get({
      page: 1,
      limit: 4,
      ticket_code: '',
      service_id: '',
      channel: '',
      key_word: '',
      level: '',
      status: 1,
      start_date: '',
      end_date: '',
      user_id: $scope.user.id
    }).then(function (result) {
      $scope.notifications = result.data;
      $scope.totalRequest = result.total;
    });
  }

  // var landingUrl = "#!/" + $state.current.parent + $state.current.url;
  console.log($state.current);
  var CURRENT_URL = $state.current.name,
    $BODY = $('body'),
    $MENU_TOGGLE = $('#menu_toggle'),
    $SIDEBAR_MENU = $('#sidebar-menu'),
    $SIDEBAR_FOOTER = $('.sidebar-footer'),
    $LEFT_COL = $('.left_col'),
    $RIGHT_COL = $('.right_col'),
    $NAV_MENU = $('.nav_menu'),
    $FOOTER = $('footer');

  console.log(CURRENT_URL);

  // Sidebar
  $(document).ready(function() {
    // TODO: This is some kind of easy fix, maybe we can improve this
    var setContentHeight = function () {
      // reset height
      $RIGHT_COL.css('min-height', $(window).height());

      var bodyHeight = $BODY.outerHeight(),
        footerHeight = $BODY.hasClass('footer_fixed') ? -10 : $FOOTER.height(),
        leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
        contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

      // normalize content
      contentHeight -= $NAV_MENU.height() + footerHeight;

      $RIGHT_COL.css('min-height', contentHeight);
    };

    $SIDEBAR_MENU.find('a').on('click', function(ev) {
      var $li = $(this).parent();

      if ($li.is('.active')) {
        $li.removeClass('active active-sm');
        $('ul:first', $li).slideUp(function() {
          setContentHeight();
        });
      } else {
        // prevent closing menu if we are on child menu
        if (!$li.parent().is('.child_menu')) {
          $SIDEBAR_MENU.find('li').removeClass('active active-sm');
          $SIDEBAR_MENU.find('li ul').slideUp();
        }

        $li.addClass('active');

        $('ul:first', $li).slideDown(function() {
          setContentHeight();
        });
      }
    });

    // toggle small or large menu
    $MENU_TOGGLE.on('click', function() {
      if ($BODY.hasClass('nav-md')) {
        $SIDEBAR_MENU.find('li.active ul').hide();
        $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
      } else {
        $SIDEBAR_MENU.find('li.active-sm ul').show();
        $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
      }

      $BODY.toggleClass('nav-md nav-sm');

      setContentHeight();
    });

    // check active menu
    // $SIDEBAR_MENU.find('a[ui-sref="' + CURRENT_URL + '"]').parent('li').addClass('current-page');
    //
    // $SIDEBAR_MENU.find('a').filter(function () {
    //   return this.href == CURRENT_URL;
    // }).parent('li').addClass('current-page').parents('ul').slideDown(function() {
    //   setContentHeight();
    // }).parent().addClass('active');
    //
    // recompute content when resizing
    $(window).resize(function(){
      setContentHeight();
    });

    setContentHeight();


    // fixed sidebar
    if ($.fn.mCustomScrollbar) {
      $('.menu_fixed').mCustomScrollbar({
        autoHideScrollbar: true,
        theme: 'minimal',
        mouseWheel:{ preventDefault: true }
      });
    }
  });
// /Sidebar

  // Panel toolbox
  // $(document).ready(function() {
  //   $('.collapse-link').on('click', function() {
  //     var $BOX_PANEL = $(this).closest('.x_panel'),
  //       $ICON = $(this).find('i'),
  //       $BOX_CONTENT = $BOX_PANEL.find('.x_content');
  //
  //     // fix for some div with hardcoded fix class
  //     if ($BOX_PANEL.attr('style')) {
  //       $BOX_CONTENT.slideToggle(200, function(){
  //         $BOX_PANEL.removeAttr('style');
  //       });
  //     } else {
  //       $BOX_CONTENT.slideToggle(200);
  //       $BOX_PANEL.css('height', 'auto');
  //     }
  //
  //     $ICON.toggleClass('fa-chevron-up fa-chevron-down');
  //   });
  //
  //   $('.close-link').click(function () {
  //     var $BOX_PANEL = $(this).closest('.x_panel');
  //
  //     $BOX_PANEL.remove();
  //   });
  // });
// /Panel toolbox
});

