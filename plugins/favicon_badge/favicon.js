// Favicon.js - Change favicon dynamically [http://ajaxify.com/run/favicon].
// Copyright (c) 2008 Michael Mahemoff. Icon updates only work in Firefox and Opera.
// Background and MIT License notice at end of file, see the homepage for more.

/* USAGE:

    favicon.change("/icon/active.ico", "new title"); // Cancels any animation/scrolling
    favicon.change("/icon/active.ico"); // leaves title alone. Cancels any animation.
    favicon.change(null, "new title"); // leaves icon alone. Cancels any scrolling.

    favicon.animate(["icon1.ico", "icon2.ico", ...]);
    favicon.animate(["icon1.ico", "icon2.ico", ...], {delay: 500} );
      // Tip: Use "" as the last element to make an empty icon between cycles.
      // Default delay is 2000ms
    // animate() cancels any previous animation

    favicon.scrollTitle("new title");
    favicon.scrollTitle("new title", { delay: 200, gap: "------"} )
      // delay is delay between each scroll unit
      // gap is string appended to title (default: "      ")
    // scrollTitle() cancels any previous scrolling

    favicon.unscroll();

    favicon.unanimate();
*/

(function(namespace) {

  var scrollTimer, animateTimer, iconSequence, animateIndex, iconURL, isBadged;

  function preloadIcons() {
    var dummyImageForPreloading = document.createElement("img");
    for (var i=0; i<iconSequence.length; i++) {
      dummyImageForPreloading.src = iconSequence[i];
    }
  }

  var head;
  function getHead() {
    if (head) return head;
    if (head = document.getElementsByTagName("head")) return head = head[0];

    head = document.createElement("head");
    document.insertBefore(head, document.firstChild);
    return head;
  }

  var faviconLink;
  function addLink(url) {
    var head = getHead();
    if (faviconLink) head.removeChild(faviconLink); // unnecessary, but conserves memory
    faviconLink = document.createElement("link");
    faviconLink.rel = "shortcut icon";
    faviconLink.type = "image/x-icon";
    faviconLink.href=url;
    head.appendChild(faviconLink);
  }

  var canvas, context, image;
  function prepareCanvas() {

    canvas = document.createElement("canvas");
    canvas.style.border = "1px solid black";
    // document.body.appendChild(canvas);
    context = canvas.getContext('2d');  

    // canvas.style.display = "none";
    canvas.width = canvas.height = 16;
    if (!context) return; // canvas not supported :(

    image = new Image();  
    image.width = image.height = 16;

  }

  function drawText(context, message) {
    if (message) message = ""+message;
    if (message && message.length) {

      var textHeight = 10;
      context.font = "bold "+textHeight+"px sans-serif";
      context.fillStyle = "#f00";  
      var width = context.measureText(message).width+2;
      var height = textHeight;
      context.fillRect(16-width,16-height,width,height);

      context.fillStyle = "white";  
      context.textAlign = "right";
      context.textBaseline = "alphabetic"; 
      context.fillText(message,15,15,16);
    }

  }


  var favicon = namespace.favicon = {

    change: function(optionalIconURL, optionalDocTitle) {
      if (optionalIconURL) {
        clearTimeout(animateTimer);
        addLink(optionalIconURL, true);
      }
      if (optionalDocTitle) {
        clearTimeout(scrollTimer);
        document.title = optionalDocTitle;
      }
    },

    animate: function(_iconSequence, options) {

      iconSequence = _iconSequence;
      options = options || {};
      options.delay = parseInt(options.delay) || 2000;

      favicon.unanimate();
      animateIndex = 0;
      favicon.change(iconSequence[0]);
      animateTimer = setInterval(function() {
        animateIndex = (animateIndex+1) % iconSequence.length;
        addLink(iconSequence[animateIndex], false);
      }, options["delay"]);

      preloadIcons();

    },

    url: function() {
      if (faviconLink) return faviconLink.href;
      var links = document.getElementsByTagName("link");
      for (var i=0; i<links.length; i++) {
        if (links[i].rel=="shortcut icon") return links[i].href;
      }
    },

    unanimate: function() {
      clearTimeout(animateTimer);
    },

    scrollTitle: function(title, options) {
      favicon.unscroll();
      options = options || {};
      options["delay"] = options["delay"] || 250;
      options["gap"]   = options["gap"]   || "     ";
      title = title+options["gap"];
      document.title = title;
      titleOffset = 0;
      scrollTimer = setInterval(function() { 
        var startPos = (titleOffset++) % title.length;
        var newTitle = title.substr(startPos);
        newTitle += title.substr(0,startPos);
        document.title = newTitle;
      }, options["delay"]); 
    },  

    unscroll: function() {
      clearTimeout(this.scrollTimer);
    },
        
    changeTitle: function(title) {
      document.title = title;
    },

    badge: function(message) {
      iconURL = favicon.url();
      isBadged = true;

      prepareCanvas();
      image.onload = function() { 
        context.fillStyle = "rgba(0,0,0,1)"
        context.fillRect(0,0,16,16);
        context.drawImage(image,0,0,16,16); // reset any previous badge
        drawText(context, message);
        favicon.change(canvas.toDataURL("image/png"));
      }
      image.src = iconURL;
    }
  }

})( (function() {
  return (typeof exports!="undefined") ? exports : window;
})() );
