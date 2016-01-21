/**
 * Created by star on 16/1/19.
 */
/*
 * note.catalog.js
 * Chat feature module for SPA
 */

/* global $, note, Handlebars */

note.catalog = (function () {

  var
    configMap = {

      settable_map : {
        catalog_model : true,
        setCatalogAnchor : true
      },

      catalog_model: null,
      setCatalogAnchor: null
    },
    templateMap = {
      catalog_template: null,
      catalog_collection_template: null
    },
    stateMap = {
      $container: null,
      catalog_array : [],
      catalog_selected : null,

    },
    jQueryMap = {},
    setJqueryMap, initModule, render,
    updateJqueryMap,setSelected,
    addCatalog, editCatalog, deleteCatalog,
    configModule, renderNewCatalog,renderCatalogArray,
    onClickAddCatalog, onClickCatalog, onDisappearNewCatalog;


  // DOM method
  setJqueryMap = function () {

    var $container = stateMap.$container;

    jQueryMap = {
      $container: $container,
      $catalog_wrap: $container.find('#catalog-wrap'),
      $catalog_array: $container.find('.catalog'),
      $add_catalog_button: $container.find('.add-catalog'),
      $edit_catalog_button: $container.find('.edit-catalog'),
      $delete_catalog_button: $container.find('.delete-catalog'),
      $new_catalog_input: $container.find('.new-catalogue-input')
    };

  };

  updateJqueryMap = function () {

    jQueryMap.$catalog_array = jQueryMap.$container.find('.catalog');

  };

  // View module:
  // Render catalog area
  // Arguments:
  //    * catalog_array : An array of catalog data

  render = function (catalog_data) {

    if ( $.isArray(catalog_data) ) {
      renderCatalogArray(catalog_data);
    } else {
      renderNewCatalog(catalog_data);
    }
  };

  // View module
  // Render new catalog
  // Arguments:
  //   * catalog : catalog object
  //
  renderNewCatalog = function (catalog) {
    var new_catalog;

    if (catalog.id) {

      new_catalog = templateMap.catalog_template(catalog);
      jQueryMap.$catalog_array.removeClass('selected');
      jQueryMap.$catalog_wrap.prepend($(new_catalog))
    }

  };

  // View module
  // Render catalog array in the right place
  // Arguments:
  //   * catalog_array : catalog array
  //
  renderCatalogArray = function (catalog_array) {
    if ($.isArray(catalog_array)) {

      var content = {
        catalogs: catalog_array
      };

      jQueryMap.$catalog_wrap.html(templateMap.catalog_collection_template(content))

    }
  };

  // TODO
  addCatalog = function (title) {

    setTimeout(function(){

      var newCata = {
        id: '_001',
        title: title,
        noteCount: 0
      };

      renderNewCatalog(newCata);
      updateJqueryMap();
      configMap.setCatalogAnchor(newCata.id, newCata.noteCount);
    },100);
  };

  // Event handle
  // Handle click catalog event
  onClickCatalog = function (event){

    $target = $(this);
    var setCatalogAnchor = configMap.setCatalogAnchor;
    if (!$target.hasClass('selected')) {

      jQueryMap.$catalog_array.removeClass('selected');
      $target.addClass('selected');
      $('.delete-catalog').addClass('g_pointer');

      stateMap.catalog_selected = $target;

      setCatalogAnchor($target.data('id'),$target.data('count'));

    }

    return false;
  };

  // Handle click AddCatalog button
  onClickAddCatalog = function (event) {
    jQueryMap.$new_catalog_input.show().focus()
  };

  // Handle NewCatalog input blur or 'Enter' press
  onDisappearNewCatalog = function (event) {
    var $target = $(event.target);

    if ($target.val()) {
      addCatalog($target.val());
    } else if(jQueryMap.$catalog_array.length === 0){

      return false;
    }
    $target.val('').hide();
    return false;
  };


  // Public module
  // Configure the module prior to initialization
  // Arguments :
  //  * setCatalogAnchor - a callback to modify the URI anchor
  //                       to indicate selected catalog
  //  * catalog_model    - the catalog model object provides methods
  //                       to interact with catalog data
  configModule = function (input_map){
    note.util.setConfigMap({
      input_map: input_map,
      settable_map : configMap.settable_map,
      config_map   : configMap
    });
    return true
  };

  // Public module
  // Initialize catalog module
  initModule = function ($container) {

    stateMap.$container = $container;
    templateMap.catalog_template = Handlebars.compile($('#catalog-template').html());
    templateMap.catalog_collection_template = Handlebars.compile($('#catalog-collection-template').html());

    stateMap.catalog_array = configMap.catalog_model;


    setJqueryMap();
    render(stateMap.catalog_array);
    updateJqueryMap();


    $(document).on('click','.catalog',onClickCatalog);
    jQueryMap.$add_catalog_button.click( onClickAddCatalog );
    jQueryMap.$new_catalog_input.blur( onDisappearNewCatalog).keyup(function (event) {
      if (event.keyCode == 13) {
          onDisappearNewCatalog(event);
      }
    });

    if(jQueryMap.$catalog_array.length === 0 ){

      configMap.setCatalogAnchor(null);

    } else {

      configMap.setCatalogAnchor(stateMap.catalog_array[0].id,stateMap.catalog_array[0].note_count)

    }

    return true;
  };

  // Public module
  // Select the specify catalog
  // Arguments:
  //   * catalogId - the id of the selected catalog

  setSelected = function (catalogId) {

    if( catalogId == null ){
      jQueryMap.$new_catalog_input.show().focus()
    } else {
      jQueryMap.$catalog_array.removeClass('selected');
      jQueryMap.$catalog_array.each(function (index,catalog_dom) {
        if($(catalog_dom).data('id') === catalogId){
          $(catalog_dom).addClass('selected');
        }
      });

    }
  };

  return {
    initModule: initModule,
    configModule: configModule,
    setSelected: setSelected
  };

})();