/*
 * note.js
 * Root namespace module
 */

/*  global $, note */

var note = (function(){
  'use strict';

  var initModule = function ( $container ) {
    note.shell.initModule( $container );
  };

  return { initModule: initModule };
})();

(function( $ ){

  $(document).ready(function(){
    note.initModule( $('#note') );
  });

})(jQuery);