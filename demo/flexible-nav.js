// Flexible Nav Javascript Library.
// ================================
// **Flexible Nav** is a **Javascript** library
// which add a right navigation panel.
// It improves a web page **navigation** and help
// to **visualize** different sections
// of a document, an article,.. any web page.
//
// Nav links are **distributed proportionnally** to the page sections.
// See how **your scrollbar *"weds"* this links** :)
//
// You can easily use it on any website with the *Bookmarklet*.
//
// **Drag and Drop this like to in your bookmark bar :**
//
//  <a class="bookmark" title="Flexible Nav bookmarklet" href="javascript:(function(){window.flexibleNavBase='http://lib.greweb.fr/flexible-nav/';var a=document.getElementsByTagName('head')[0],b=document.createElement('script');b.type='text/javascript';b.src=flexibleNavBase+'bookmarklet.min.js';a.appendChild(b);})(); void 0" target="_blank">Flexible Nav Bookmarklet</a>
//
// **This page is a 3-in-one document!**
//
// * First, it explains goal and possible usages of the library.
// * Second, it presents **a library usage** 
// (see the flexible box right panel?).
// * Third, it show and comment the **annotated JS code** (thanks to docco)
//
// Usages
// ----- 
// 
// #### Generation + Flexibility ####
//
// The library can generate for you the nav sidebar content
// providing elements to display in navigation.
//
// By default, it use `h1` to `h3` elements to retrieve and locate
// the different sections of a document but you can override this
// elements selector.
//
// You have usually two kind of selected elements to use:
//
// * **Select a title**. The link will takes the title as text.
// * **Select any container** and add a **`data-navtext` attribute** and
// set it with the text you want.
//
// Example: `<div id="demo" data-navtext="Demo of the game">...`
//
// * Simple usage used in this page
//
//			var nav = new FlexibleNavMaker().make().prependTo('body');
//			new FlexibleNav(nav);
//
//	* Selecting element you want
//
//			new FlexibleNavMaker(".navtitle");
//
//	Using this code, all nodes having this `navtitle` class 
//	will appear in the flexible nav panel.
//
// #### Flexibility only ####
//
// You can also generate your own nav links to have more controls of used links.
// Conventionnally, you need to use
// a `<nav />` element with a `flexible-nav` class.
//
// * Add Flexibility to existing nav
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
(function(){
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

    // ### .update() ###
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
          if(target.is(':visible'))
            node.show();
          else
            node.hide();
        }
      });
    }

    // ### Init ###
    // Bind window resize and init nav.
    $(window).resize(function(){
      self.update();
    });
    self.updateClasses();
    self.update();
  }
}());
