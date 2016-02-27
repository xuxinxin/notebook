/**
 * Created by star on 16/1/26.
 */
requirejs.config({
  //By default load any module IDs from js/lib
  //except, if the module ID starts with "app",
  //load it from the js/app directory. paths
  //config is relative to the baseUrl, and
  //never includes a ".js" extension since
  //the paths config could be for a directory.
  shim: {
    "jquery.uriAnchor": ["jquery"]
  },
  paths: {
    "jquery" : "libraries/jquery",
    "jquery.uriAnchor": "libraries/jquery.uriAnchor",
    "taffy": "libraries/taffydb",
    "handlebar": "libraries/handlebars"
    //"Promise": "libraries/npo.src"
  }
});

requirejs(['jquery','taffy','catalog_model', 'shell'], function($,_taffy , catalog_model, shell){
  //console.log($);
  //console.log(TAFFY);
  catalog_model.initModule().then(
    function success(){
      shell.initModule( $('#note') );
    },
    function error(){
     console.error('Something unexpected happened..T T');
  });

});

