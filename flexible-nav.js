(function(){
  "use strict";

  var _uuid = 0;
  var uuid = function(){ return ++_uuid; };

  var tmplNav = function(links) {
    var nav = $('<nav class="flexible-nav"><ul></ul></nav>');
    var lis = $.map(links, function(link){
      return $('<li><a href="'+link.href+'">'+link.text+'</a></li>')[0];
    });
    nav.find('ul').append(lis);
    return nav;
  }

  // Dynamically create a nav
  // ------------------------
  // `selector` select all nodes to add in nav.
  // using 'h1, h2, h3' if not setted
  window.FlexibleNavMaker = function(selector) {
    var self = this;
    self.nodes = $(selector || 'h1,h2,h3');

    self.make = function() {
      var links = self.nodes.map(function(){
        var node = $(this);
        var id = node.attr('id');
        if(!id) {
          while(!id) {
            id = 'n'+( uuid() );
            if($('#'+id).size()>0) id = null;
          }
          node.attr('id', id);
        }
        return {
          href: '#'+id,
          text: node.attr('data-navtext') || node.text()
        }
      });
      return tmplNav(links);
    }
  }

  // nav dom element
  window.FlexibleNav = function(nav) {
    var self = this;
    self.nav = $(nav);

    self.links =  self.nav.find('a');

    var targetForLink = function(node) {
      var href = $(node).attr('href');
      if(href.substring(0,1) == '#') {
        var target = $(href);
        return target.size() ? target : null;
      }
      return null;
    }

    self.links.each(function(){
      var node = $(this);
      var target = targetForLink(node);
      if(target) {
        // Set the **target node name**.
        // Example: class `tnn-h1`
        node.addClass('tnn-'+target[0].nodeName.toLowerCase()); 
      }
    });

    self.update = function() {
      var height = $('body').height();
      var windowHeight = $('window').height();
      self.links.each(function() {
        var node = $(this);
        var target = targetForLink(node);
        if(target) {
          var percent = 100*target.offset().top/height;
          node.css('top', percent+'%');
        }
      });
    }

    $(window).resize(function(){
      self.update();
    });
    self.update();
  }
}());
