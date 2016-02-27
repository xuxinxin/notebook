/**
 * Created by star on 16/1/19.
 */
/*
 * note.catalog.js
 * Catalogue feature module for SPA
 */

/* global $, note, Handlebars */

define(['jquery', 'handlebar', 'util', 'catalog_model'], function ($, __handlebar, util, catalog_model) {

  var
    configMap = {

      settable_map: {
        catalog_model: true,
        setCatalogAnchor: true
      },

      catalog_model: null,
      setCatalogAnchor: null
    },
    template_map = {
      catalog_template: null,
      catalog_collection_template: null
    },
    state_map = {
      $container: null,
      catalog_array: [],
      $selected: null,

    },
    jQueryMap = {},
    setJqueryMap, initModule, render,
    updateJqueryMap, setSelected,
    addCatalog, editCatalog, deleteCatalog,
    configModule, renderNewCatalog, renderCatalogArray,
    onClickAddCatalog, onClickEditCatalog,onClickDeleteCatalog, onClickCatalog, onBlurInputNewCatalog, onDoubleClickCatalog, onBlurTitle;


  // DOM method
  setJqueryMap = function () {

    var $container = state_map.$container;

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

    if ($.isArray(catalog_data)) {
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

      new_catalog = template_map.catalog_template(catalog);
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

      jQueryMap.$catalog_wrap.html(template_map.catalog_collection_template(content))

    }
  };

  // TODO
  addCatalog = function (title) {

    catalog_model.add({title: title, note_count: 0})
      .then(function (new_catalog) {
        renderNewCatalog(new_catalog);
        updateJqueryMap();
        configMap.setCatalogAnchor(new_catalog.id, new_catalog.note_count);

      });

    //renderNewCatalog(newCata);
    //updateJqueryMap();
    //configMap.setCatalogAnchor(newCata.id, newCata.note_count);
  };

  // Event handle
  // Handle click catalog event
  onClickCatalog = function (event) {

    $target = $(this);

    event.preventDefault();
    if (!$target.hasClass('selected')) {
      configMap.setCatalogAnchor($target.data('id'), $target.data('count'));
    }

    return false;
  };

  // Handle double click event
  onDoubleClickCatalog = function (event) {
    console.log('double click');
    event.preventDefault();
    $(this).find('.title').attr('contentEditable', true).focus();
    console.log(state_map.$selected);
  };

  onBlurTitle = function (event) {
    event.preventDefault();
    $(event.target).attr('contentEditable', false);

    catalog_model.update({
      title: $(event.target).text()
    });

  };


  // Handle click AddCatalog button
  onClickAddCatalog = function (event) {
    jQueryMap.$new_catalog_input.show().focus();
  };

  onClickEditCatalog = function () {
    console.log('click',state_map.$selected.find('.title'));
    state_map.$selected.find('.title').attr('contentEditable', true).focus();
    updateJqueryMap();
  };

  onClickDeleteCatalog = function() {
    var $remove = state_map.$selected, setAnchor = configMap.setCatalogAnchor;

    catalog_model.remove($remove.id);

    console.log($remove);
    if($remove.next().length > 0){
      setAnchor($remove.next().data('id'),$remove.next().data('count'));
      $remove.remove();
    }else if($remove.prev().length > 0){
      console.log('prev');
      setAnchor($remove.prev().data('id'),$remove.prev().data('count'));
      $remove.remove();
    }else{
      setAnchor(null);
      $remove.remove();
    }

    updateJqueryMap();
  };

  // Handle NewCatalog input blur or 'Enter' press
  onBlurInputNewCatalog = function (event) {
    var $target = $(event.target);

    if ($target.val()) {
      addCatalog($target.val());
    } else if (jQueryMap.$catalog_array.length === 0) {

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
  configModule = function (input_map) {
    util.setConfigMap({
      input_map: input_map,
      settable_map: configMap.settable_map,
      config_map: configMap
    });
    return true;
  };

  // Public module
  // Initialize catalog module
  initModule = function ($container) {

    state_map.$container = $container;
    template_map.catalog_template = Handlebars.compile($('#catalog-template').html());
    template_map.catalog_collection_template = Handlebars.compile($('#catalog-collection-template').html());

    state_map.catalog_array = configMap.catalog_model;


    setJqueryMap();
    render(state_map.catalog_array);
    updateJqueryMap();


    $(document).on('click', '.catalog', onClickCatalog);
    $(document).on('dblclick', '.catalog', onDoubleClickCatalog);


    $(document).on('blur', '.title', onBlurTitle);
    $(document).on('keydown', '.title', function (event) {
      console.log('key down');
      if (event.keyCode === 13) {
        event.preventDefault();
        onBlurTitle(event);
      }
    });

    jQueryMap.$add_catalog_button.click(onClickAddCatalog);
    jQueryMap.$edit_catalog_button.click(onClickEditCatalog);
    jQueryMap.$delete_catalog_button.click(onClickDeleteCatalog);


    jQueryMap.$new_catalog_input.blur(onBlurInputNewCatalog).keyup(function (event) {
      if (event.keyCode == 13) {
        onBlurInputNewCatalog(event);
      }
    });

    if (jQueryMap.$catalog_array.length === 0) {

      configMap.setCatalogAnchor(null);

    } else {

      configMap.setCatalogAnchor(state_map.catalog_array[0].id, state_map.catalog_array[0].note_count)

    }

    return true;
  };

  // Public module
  // Select the specify catalog
  // Arguments:
  //   * catalogId - the id of the selected catalog

  setSelected = function (catalogId) {
    var setCatalogAnchor = configMap.setCatalogAnchor;
    if (catalogId == null) {
      jQueryMap.$new_catalog_input.show().focus();

    } else {
      jQueryMap.$catalog_array.removeClass('selected');
      jQueryMap.$catalog_array.each(function (index, catalog_dom) {
        if ($(catalog_dom).data('id') === catalogId) {
          $(catalog_dom).addClass('selected');
          state_map.$selected = $(catalog_dom);

        }
      });

    }
  };

  return {
    initModule: initModule,
    configModule: configModule,
    setSelected: setSelected
  };

});