(function(){
  "use strict";

  // **Utilities functions.**
  //
  // Generate an unique number identifier
  var _uuid = 0;
  var uuid = function(){ return ++_uuid; };

  // Template for creating a nav element with links.
  //
  // * arg `links` : an Array of *{ href, text }*
  var tmplNav = function(links) {
    var nav = $('<nav class="flexible-nav"><ul></ul></nav>');
    var lis = $.map(links, function(link){
      return $('<li><a href="'+link.href+'">'+link.text+'</a></li>')[0];
    });
    nav.find('ul').append(lis);
    return nav;
  }
    
  var targetForLink = function(node) {
    var href = $(node).attr('href');
    if(href.substring(0,1) == '#') {
      var target = $(href);
      return target.size() ? target : null;
    }
    return null;
  }


  // FlexibleNavMaker
  // ------------------------
  // Dynamically create a nav.
  //
  // * arg `selector` (optional) : selector for all nodes to add in nav.
  // using 'h1, h2, h3' if not setted.
  window.FlexibleNavMaker = function(selector) {
    var self = this;
    self.nodes = $(selector || 'h1,h2,h3');
    
    // An instance of FlexibleNavMaker contains only a `make` method
    // which create the nav element with nodes matching `selector`.
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

  // FlexibleNav
  // -----------
  // Make a nav element "flexible".
  //
  // * `nav` : a nav DOM element
  window.FlexibleNav = function(nav) {
    var self = this;
    self.nav = $(nav);

    // Init links adding some classes
    self.updateClasses = function() {
      self.nav.find('a').each(function(){
        var node = $(this);
        var target = targetForLink(node);
        if(target) {
          // Set the **target node name**.
          // Example: class `tnn-h1`
          node.addClass('tnn-'+target[0].nodeName.toLowerCase()); 
        }
      });
    }
    // Update the nav element.
    self.update = function() {
      var height = $('body').height();
      var windowHeight = $('window').height();
      self.nav.find('a').each(function() {
        var node = $(this);
        var target = targetForLink(node);
        if(target) {
          var percent = 100*target.offset().top/height;
          node.css('top', percent+'%');
        }
      });
    }

    // Bind window resize and init nav.
    $(window).resize(function(){
      self.update();
    });
    self.updateClasses();
    self.update();
  }
}());
