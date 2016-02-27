/**
 * Created by star on 16/1/19.
 */
/*
 * note.catalog.js
 * Catalogue feature module for SPA
 */

/* global $, note, Handlebars */

define(['jquery', 'handlebar', 'util'], function ($, __handlebar, util) {

  console.log('Preview module ');
  var
    config_map = {
      settable_map: {
        note_model: true,
        setPreviewAnchor: true
      },

      note_model: null,
      setPreviewAnchor: null
    },
    template_map = {
      preview_template: null,
      preview_collection_template: null
    },
    state_map = {
      $container: null,
      note_array: [],
      $selected: null
    },
    jQuery_map = {},
    setJqueryMap, updateJqueryMap, initModule, configModule,
    render, renderPreviewArray, renderNewPreview;

  setJqueryMap = function () {
    var $container = state_map.$container;

    jQuery_map = {
      $container: $container,
      $preview_wrap: $container.find('#previw-wrap'),
      $preview_array: $container.find('.preview'),
      $add_note_button: $container.find('.create-notebook-button')
    }
  };

  updateJqueryMap = function () {
    jQuery_map.$preview_array = jQuery_map.$container.find('.preview');
  };

  configModule = function (input_map) {
    util.setConfigMap({
      input_map: input_map,
      settable_map: config_map.settable_map,
      config_map: config_map
    });
    return true;
  };

  render = function (preview_data) {

    if ($.isArray(preview_data)) {

      renderPreviewArray(preview_data);
    } else {
      renderNewPreview(preview_data);
    }

  };
  renderNewPreview = function(){

  }
  renderPreviewArray = function (preview_array) {

    if (preview_array.length > 0) {
      var content = {
        previews: preview_array
      };
      console.log(content)
      $('#preview-wrap').html(template_map.preview_collection_template(content));
    }
  };

  initModule = function ($container) {
    console.log('Preview module init...');

    state_map.$container = $container;
    template_map.preview_template = Handlebars.compile($('#empty-preview-template').html());
    template_map.preview_collection_template = Handlebars.compile($('#preview-collection-template').html());

    state_map.note_array = config_map.note_model;

    setJqueryMap();
    render(state_map.note_array);
    updateJqueryMap();


    return true;
  };


  return {
    initModule: initModule,
    configModule: configModule
  }


});