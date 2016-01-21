/*
 * note.shell.js
 * Shell module for note SPA
 */

/* global $, note, Handlebars */

note.shell = (function () {

  var configMap = {},
    stateMap = {
      $container: null,
      is_editor: true,
      anchor_map: {}
    },
    jqueryMap = {},
    setJqueryMap, changeAnchorPart, copyAnchorMap,
    onHashChange, onLogin,  onLogout,
    setNoteAnchor, setCatalogAnchor, initModule;

  // Returns copy of stored anchor map; minimizes overhead
  copyAnchorMap = function () {
    return $.extend(true, {}, stateMap.anchor_map);
  };


  // DOM method /setJqueryMap/
  setJqueryMap = function () {
    var $container = stateMap.$container;

    jqueryMap = {
      $container: $container,
      $catalog: $container.find('.note-catalog'),
      $mainArea: $container.find('.main'),
      $preview: $container.find('.note-preview'),
      $content: $container.find('.note-content'),
      $editor: $container.find('.note-editor')
    };

  };

  // DOM method /changeAnchorPart/
  // Purpose  : Changes part of the URI anchor component
  // Arguments:
  //   * arg_map - The map describing what part of the URI anchor
  //     we want changed.
  // Returns  : boolean
  //   * true  - the Anchor portion of the URI was update
  //   * false - the Anchor portion of the URI could not be updated
  // Action   :
  //   The current anchor rep stored in stateMap.anchor_map.
  //   See uriAnchor for a discussion of encoding.
  //   This method
  //     * Creates a copy of this map using copyAnchorMap().
  //     * Modifies the key-values using arg_map.
  //     * Manages the distinction between independent
  //       and dependent values in the encoding.
  //     * Attempts to change the URI using uriAnchor.
  //     * Returns true on success, and false on failure.
  //
  changeAnchorPart = function (arg_map) {
    var anchor_map_revise = copyAnchorMap(),
      bool_return = true,
      key_name, key_name_dep;

    for (key_name in arg_map) {
      if (arg_map.hasOwnProperty(key_name)) {
        if (key_name.indexOf('_') === 0) {
          break;
        }

        // skip dependent keys during iteration
        anchor_map_revise[key_name] = arg_map[key_name];

        // update independent key value
        key_name_dep = '_' + key_name;

        if (arg_map[key_name_dep]) {
          anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
        } else {
          delete  anchor_map_revise[key_name_dep];
          delete  anchor_map_revise['_s' + key_name_dep];
        }
      }
    }

    try {
      $.uriAnchor.setAnchor(anchor_map_revise);
    }
    catch (error) {
      $.uriAnchor.setAnchor(stateMap.anchor_map);
      bool_return = false;
    }

    return bool_return;

  };


  // Event handler /onHashchange/
  // Purpose    : Handles the hashchange event
  // Arguments  :
  //   * event - jQuery event object.
  // Settings   : none
  // Returns    : false
  // Actions    :
  //   * Parses the URI anchor component
  //   * Compares proposed application state with current
  //   * Adjust the application only where proposed state
  //     differs from existing and is allowed by anchor schema
  //

  onHashChange = function (event) {
    var anchor_map_previous = copyAnchorMap(),
      is_ok = true,
       s_note_proposed,catalog_id_proposed,
      anchor_map_proposed;

    try {
      anchor_map_proposed = $.uriAnchor.makeAnchorMap();
    }
    catch (error) {
      $.uriAnchor.setAnchor(anchor_map_previous, null, true);
      return false;
    }

    stateMap.anchor_map = anchor_map_proposed;

    if (anchor_map_previous !== anchor_map_proposed) {

      s_note_proposed = anchor_map_proposed.note;
      catalog_id_proposed = anchor_map_proposed.catalogId;
      switch (s_note_proposed){
        case 'init':
          console.log('init')
          note.catalog.setSelected(null);
          break;
        case 'edit':
          console.log('edit')
          note.catalog.setSelected(catalog_id_proposed);
          note.model.catalog.setSelected(catalog_id_proposed);
          break;
        case 'read':
          console.log('read')
          note.catalog.setSelected(catalog_id_proposed);
          note.model.catalog.setSelected(catalog_id_proposed);
          break;
        default :
      }


    }

    if( !is_ok){
      if(anchor_map_previous){
        $.uriAnchor.setAnchor(anchor_map_previous, null, true);
        stateMap.anchor_map = anchor_map_previous;
      }else{
        delete anchor_map_proposed.note;
        delete anchor_map_proposed._note;

        $.uriAnchor.setAnchor( anchor_map_proposed, null, true);
      }
    }

    return false;
  };

  onLogin = function(){
    // TODO
  };

  onLogout = function(){
    // TODO
  };

  // callback method /setNoteAnchor/
  // Example  : setNoteAnchor(1111111,111111)
  // Purpose  : Change the chat component of the anchor
  // Arguments:
  //   * catalogId - the catalog id which the note belongs to
  //   * noteId - the note id
  // Action   :
  //   Changes the URI anchor parameter 'note' to 'read'
  //   other than noteId is null or 'edit'
  //   * true  - requested anchor part was updated
  //   * false - requested anchor part was not updated
  // Throws   : none

  setNoteAnchor = function(catalogId,noteId){
    var note_anchor_map ={
      note: '',
      _note: {
        catalogId: catalogId,
        noteId: noteId
      }
    };

    if(noteId != undefined){
      note_anchor_map.note = 'read';
    }else {
      note_anchor_map.note = 'edit';
    }

    return changeAnchorPart(note_anchor_map);
  };

  setCatalogAnchor = function (catalogId, noteCount) {

    // TODO: 如果此目录的文章为空

    if (catalogId == null){
      changeAnchorPart({
        note: 'init'
      })
    }else{
      if(noteCount){
        changeAnchorPart({
          note: 'read',
          catalogId: catalogId
        })
      } else {
        changeAnchorPart({
          note: 'edit',
          catalogId: catalogId
        })
      }
    }
  };


  initModule = function ($container) {

    stateMap.$container = $container;
    setJqueryMap();



    var catalogDb = note.model.catalog.getDb();

    note.catalog.configModule({
        setCatalogAnchor : setCatalogAnchor,
        catalog_model: catalogDb().get()  //note.model.catalog
      }
    );

    note.catalog.initModule(jqueryMap.$catalog);

    $(window).bind( 'hashchange', onHashChange).trigger( 'hashchange' );

    $.gevent.subscribe( $container, 'spa-login',  onLogin  );
    $.gevent.subscribe( $container, 'spa-logout', onLogout );



  };

  return {initModule:initModule};

})();