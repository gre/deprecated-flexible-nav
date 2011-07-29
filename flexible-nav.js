// Flexible Nav jQuery library.
// ================================
// **Flexible Nav** is a small **jQuery** library
// which add a smart nav sidebar to the right.
// It improves a web page **navigation** and helps
// to **visualize** different sections
// of a document, an article,.. any web page.
//
// Nav links are **distributed proportionally** to the page sections.
// See how **your scrollbar *"weds"* these links** :)
//
// - - -
//
// You can easily use it on any website with the *Bookmarklet*.
//
// **Save this bookmark** by drag and dropping it in your bar...
//
// <a class="bookmark" title="Flexible Nav bookmarklet" href="javascript:(function(){window.flexibleNavBase='http://lib.greweb.fr/flexible-nav/';var a=document.getElementsByTagName('head')[0],b=document.createElement('script');b.type='text/javascript';b.src=flexibleNavBase+'bookmarklet.min.js';a.appendChild(b);})(); void 0" target="_blank">FlexibleNav bookmarklet</a>
//
// ...and **click on it in any website**!
// 
// - - -
//
// **This page is a 3-in-one document!**
//
// * First, it explains goals and possible usages of the library.
// * Second, it presents **a library usage** 
// _(see this flexible box right panel?)_.
// * Third, it shows the **annotated JS code** _(thanks to docco)_
//
// Download
// --------
//
// <a class="download" target="_blank" href="https://github.com/gre/flexible-nav">Download or fork me on github</a>
//
// Usages
// ----- 
// 
// #### Generation and Flexibility ####
//
// The library can generate for you the nav sidebar content
// providing elements to display in navigation.
//
// By default, it uses `h1` to `h3` elements to retrieve and locate
// the different sections of a document but you can override these
// elements selector.
//
// You have usually two kind of selected elements to use:
//
// * **Select a title**. The link will take the title as text.
// * **Select any container** and add a **`data-navtext` attribute**
// to define the title you want.
//
// Example: `<div id="demo" data-navtext="Demo of the game">...`
//
// * **Simple usage used in this page**
//
//			var nav = new FlexibleNavMaker().make().prependTo('body');
//			new FlexibleNav(nav);
//
// * **Selecting element you want**
//
//			new FlexibleNavMaker(".navtitle");
//
//	Using this code bellow, all nodes having this `navtitle` class 
//	will appear in the flexible nav panel.
//
// #### Flexibility only ####
//
// You can also create your own nav links to have more controls of used links.
// Conventionnally, you need to use
// a `<nav />` element with a `flexible-nav` class and `<a href="#myidtarget" />` kind of elements for links.
//
// * **Add flexibility to an existing nav**
//
//			new FlexibleNav($('#myNav'));
//
// *(replace myNav by you nav id)*
//

/*!
 * Flexible Nav - 2011 - by @greweb
 */

// The code
// ========
//
(function($){
  "use strict";

  // **Utilities functions**
  //
  // Generate an unique number identifier
  var _uuid = 0;
  var uuid = function(){ return ++_uuid; };

  // Template for creating a nav element with links.
  //
  // * `links` : an Array of *{ href, text }*
  var tmplNav = function(links) {
    var nav = $('<nav class="flexible-nav"><ul></ul></nav>');
    var lis = $.map(links, function(link){
      return $('<li><a href="'+link.href+'">'+link.text+'</a></li>')[0];
    });
    nav.find('ul').append(lis);
    return nav;
  }
  

  // Retrieve a node pointed by an a element `aEl` hash href.
  var targetForLink = function(aEl) {
    var href = $(aEl).attr('href');
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
  // * `selector` (optional) : selector for all nodes to add in nav.
  // using 'h1, h2, h3' if not setted.
  window.FlexibleNavMaker = function(selector) {
    var self = this;
    self.nodes = $(selector || 'h1,h2,h3');
    
    // ### .make() ###
    // An instance of FlexibleNavMaker contains only a `make` method
    // which create the nav element with nodes matching `selector`.
    self.make = function() {
      var links = self.nodes.map(function(){
        var node = $(this);
	// Find the id or create a unique one
        var id = node.attr('id');
        if(!id) {
          while(!id) {
            id = 'n'+( uuid() );
            if($('#'+id).size()>0) id = null;
          }
          node.attr('id', id);
        }
	// The text link is the `data-navtext` attribute or the node text.
        var text = node.attr('data-navtext') || node.text();
	return { href: '#'+id, text: text };
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

    // Init links adding some classes.
    //
    // Set the target node name class.
    // Example: class `tnn-h1`
    self.updateClasses = function() {
      self.nav.find('a').each(function(){
        var node = $(this);
        var target = targetForLink(node);
        if(target) {
           node.addClass('tnn-'+target[0].nodeName.toLowerCase());
        }
      });
    }

    // ### .update() ###
    self.update = function() {
      var documentHeight = $(document).height();
      var windowHeight = $(window).height();
      
      // Transform links into array of visible target `top` position and link `node`.
      var links = self.nav.find('a').map(function(){
        var node = $(this);
        var target = targetForLink(node);
        if(target==null || !target.is(':visible')) return null;
        return {
          top: target.offset().top,
          node: node
        };
      });

      // Update nav links positions.
      $.each(links, function(i, link) {
         link.node.css('top', (100*link.top/documentHeight)+'%');
      });

      // Update current section.
      var scrollTop = $(document).scrollTop();
      var closest = null;
      $.each(links, function(i, link){
        link.node.removeClass('current');
        if(closest==null || (link.top <= scrollTop && link.top > closest.top))
          closest = link;
      });
      closest && closest.node.addClass('current');
    }

    // ### Init ###
    // Bind window resize and scroll and init nav.
    $(window).scroll(function(){
    	self.update();
    });
    self.updateClasses();
    self.update();
  }
}(jQuery));
