$(function() {
  $('#md-navbar-main .navbar-brand, .sidebar-brand>.sidebar-brand-link').click(function() {
    $('#wrapper').toggleClass('toggled');
    //hack to force reflow
    $('#navbar-main-collapse ul').hide().show(0);
  });

  $('#md-btn-help').click(function() {
    var sw = $('#sidebar-wrapper');

    $('#md-help').fadeToggle();
    sw.toggleClass('help');
  });

  $('[data-toggle="tooltip"]').tooltip();

  //setup bootstrap-select
  $('.selectpicker').selectpicker({
    iconBase : 'fa',
    tickIcon : 'fa-check'
  });

  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
    $('.selectpicker').selectpicker('mobile');
  }

  //fix scrollspy links
  //http://stackoverflow.com/a/28292699
  $("#md-scrollspy li a[href^='#']").on('click', function(event) {
    var target;
    target = this.hash;

    event.preventDefault();

    var navOffset;
    navOffset = $('#navbar').height() + 160;

    return $('html, body').animate({
      scrollTop : $(this.hash).offset().top - navOffset
    }, 300, function() {
      return window.history.pushState(null, null, target);
    });
  });

  //https://github.com/tomiford/bootstrap-overflow-navs
  /**
   * options:
   *    more - translated "more" text
   *    offset - width that needs to be subtracted from the parent div width
   */
  $.fn.overflowNavs = function(options) {
    // Create a handle to our ul menu
    // @todo Implement some kind of check to make sure there is only one?  If we accidentally get more than one
    // then strange things happen
    var ul = $(this);

    // This should work with all navs, not just the navbar, so you should be able to pass a parent in
    var parent = options.parent ? options.parent : ul.parents('.navbar');

    // Check if it is a navbar and twitter bootstrap collapse is in use
    var collapse = $('div.nav-collapse').length;
    // Boostrap < 2
    if (!collapse) {
      var collapse = $('div.navbar-collapse').length;
      // Boostrap > 2
    }

    // Check if bootstrap navbar is collapsed (mobile)
    if (collapse) {
      var collapsed = $('.btn-navbar').is(":visible");
      // Boostrap < 2
      if (!collapsed) {
        var collapsed = $('.navbar-toggle').is(":visible");
        // Boostrap > 2
      }
    } else {
      var collapsed = false;
    }

    // Only process dropdowns if not collapsed
    //if (collapsed === false) {

    // Get width of the navbar parent so we know how much room we have to work with
    var parent_width = $(parent).width() - (options.offset ? parseInt($(options.offset).width()) : 0);

    // Find an already existing .overflow-nav dropdown
    var dropdown = $('li.overflow-nav', ul);

    // Create one if none exists
    if (!dropdown.length) {
      dropdown = $('<li class="overflow-nav dropdown"></li>');
      dropdown.append($('<a class="dropdown-toggle" data-toggle="dropdown" href="#">' + options.more + '<b class="caret"></b></a>'));
      dropdown.append($('<ul class="dropdown-menu"></ul>'));
    }

    // Get the width of the navbar, need to add together <li>s as the ul wraps in bootstrap
    var width = 100;
    // Allow for padding
    ul.children('li').each(function() {
      var $this = $(this);
      width += $this.outerWidth();
    });

    // Window is shrinking
    if (width >= parent_width) {
      // Loop through each non-dropdown li in the ul menu from right to left (using .get().reverse())
      $($('li', ul).not('.dropdown').not('.dropdown li').get().reverse()).each(function() {
        // Get the width of the navbar
        var width = 100;
        // Allow for padding
        ul.children('li').each(function() {
          var $this = $(this);
          width += $this.outerWidth();
        });
        if (width >= parent_width) {
          // Remember the original width so that we can restore as the window grows
          $(this).attr('data-original-width', $(this).outerWidth());
          // Move the rightmost item to top of dropdown menu if we are running out of space
          dropdown.children('ul.dropdown-menu').prepend(this);
        }
        // @todo on shrinking resize some menu items are still in drop down when bootstrap mobile navigation is displaying
      });
    }
    // Window is growing
    else {
      // We used to just look at the first one, but this doesn't work when the window is maximized
      //var dropdownFirstItem = dropdown.children('ul.dropdown-menu').children().first();
      dropdown.children('ul.dropdown-menu').children().each(function() {
        if (width + parseInt($(this).attr('data-original-width')) < parent_width) {
          // Restore the topmost dropdown item to the main menu
          dropdown.before(this);
        } else {
          // If the topmost item can't be restored, don't look any further
          return false;
        }
      });
    }

    // Remove or add dropdown depending on whether or not it contains menu items
    if (!dropdown.children('ul.dropdown-menu').children().length) {
      dropdown.remove();
    } else {
      // Append new dropdown menu to main menu iff it doesn't already exist
      if (!ul.children('li.overflow-nav').length) {
        ul.append(dropdown);
      }
    }
    //}
  };

  $.fn.debouncer = function(func, timeout) {
    var timeoutID,
        timeout = timeout || 200;
    return function() {
      var scope = this,
          args =
          arguments;
      clearTimeout(timeoutID);
      timeoutID = setTimeout(function() {
        func.apply(scope, Array.prototype.slice.call(args));
      }, timeout);
    };
  };
  var options = {
    'more' : 'More',
    'parent' : '#md-navbars',
    'override_width' : true
  };

  $('#md-navbar-secondary').overflowNavs(options);

  $(window).resize(/*$.fn.debouncer(*/
  function() {
    $('#md-navbar-secondary').overflowNavs(options);
    //console.info(options);
  }/*, 50)*/);

  //tour
  // Instance the tour
  var tour = new Tour({
    steps : [{
      orphan : true,
      title : "Welcome!",
      backdrop : true,
      content : 'Click <b>Next</b> to take the tour. Use the buttons or <span class="fa fa-long-arrow-left"></span> <span class="fa fa-long-arrow-right"></span> arrow keys to navigate the tour. You can resume the tour from the <em>Help</em> section.'
    }, {
      element : "#md-navbar-main .nav",
      title : "Main NavBar",
      content : "This is the main navigation/tool bar.",

      placement : 'bottom'
    }, {
      element : ".navbar-brand",
      title : "Toggle SideBar",
      content : "Click the logo to open the SideBar.",
      onNext : function(tour) {
        if (!$('.sidebar-brand').is(':visible')) {
          $('.navbar-brand').click();
        }
      }
    }, {
      element : ".sidebar-brand .sidebar-brand-link",
      title : "Toggle SideBar",
      content : "Click the logo to hide the SideBar."
    }, {
      element : "#md-btn-help",
      title : "Toggle Help",
      content : 'Click the <span class="fa fa-question-circle"></span> to toggle the Help section.'
    }, {
      orphan : true,
      title : "All Good Things...",
      backdrop : true,
      content : "That's it for the demo tour. You can restart it from the <em>Help</em> section."
    }]
  });

  $('#md-btn-tour').click(function() {
    if (tour._options.steps.length !== tour.getCurrentStep() + 1) {
      tour.start(true);
    } else {
      tour.restart();
    }
  });

  $('#page-content').fadeIn(1000);

  // Initialize the tour
  tour.init();
  tour.start();
});
