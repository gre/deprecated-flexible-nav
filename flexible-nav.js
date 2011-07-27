(function(){
  "use strict";

  var _uuid = 0;
  var uuid = function(){ return ++_uuid; };

  // Dynamically create a nav
  // ------------------------
  // `selector` select all nodes to add in nav.
  // using 'h1, h2, h3' if not setted
 /*
  window.FlexibleNavMaker = function(selector) {
    var self = this;
    self.selector = selector || 'h1,h2,h3';

    self.make = function() {

    }
  }
  */

  // nav dom element
  window.FlexibleNav = function(nav) {
    var self = this;
    self.nav = $(nav);

    self.update = function() {
      var height = $('body').height();
      var windowHeight = $('window').height();
      self.nav.find('a').each(function() {
        var node = $(this);
        var href = node.attr('href');
        if(href.substring(0,1) == '#') {
          var target = $(href);
          if(target.size()>0) {
            var top = target.offset().top;
            var percent = Math.floor(100*top/height);
            node.css('top', percent+'%');
          }
        }
      });
    }

    $(window).resize(function(){
      self.update();
    });
    self.update();
  }
}());
