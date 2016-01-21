/**
 * Created by star on 16/1/19.
 */

/*
 * note.model.js
 * Model module
 */

/* global $, note */

note.model = (function () {
  'use strict';
  var
    configMap = {
    },
    stateMap = {
      catalog_cid_map: {},
      catalog_db: TAFFY(),
      cid_serial: 0,
      catalog_selected: null
    },

    isFakeData = true,
    catalog_proto, makeCatalog, catalog, initModule,
    makeCid;

  catalog_proto = {
    isSelected: function () {
      return this.cid === stateMap.catalog_selected.cid;
    }
  };

  makeCid = function () {
    return 'c' + String( stateMap.cid_serial++ );
  };

  makeCatalog = function (catalog_map) {
    var
      catalog,
      cid = catalog_map.cid,
      id = catalog_map.id,
      title = catalog_map.title,
      note_count = catalog_map.note_count;

    if (cid == undefined || !title) {
      console.error('client id and title required');
    }

    catalog = Object.create(catalog_proto);
    catalog.cid = cid;
    catalog.title = title;
    catalog.note_count = note_count;

    if (id) {
      catalog.id = id;
    }

    return catalog;

  };


  catalog = (function(){
    var getDb, setSelected, getSelected,getByCid, getCidMap, add, update, remove, completeUpdate;

    completeUpdate = function( catalog_list ){
      var catalog_map = catalog_list[0];

      delete stateMap.catalog_cid_map[catalog_map[cid]];


    };

    getDb = function () {
      return stateMap.catalog_db
    };
    setSelected = function(id){
      var catalog_db = this.getDb();
      stateMap.catalog_selected = catalog_db({cid: id}).first();
      console.log(stateMap);
    };
    getSelected = function(){
      return stateMap.catalog_selected;
    };

    getCidMap = function () {
      return stateMap.catalog_cid_map
    };

    getByCid = function (cid) {
      return stateMap.catalog_cid_map[cid];
    };

    add = function(title) {
      var sio = isFakeData ? note.fake.mockSio : note.data.getSio();
      var new_catalog;
      new_catalog = makeCatalog({
        cid: makeCid(),
        title: title,
        note_count: 0
      });

      sio.on('catalogupdate', completeUpdate);

      sio.emit('addCatalog', new_catalog);
    };


    return {
      getDb:getDb,
      setSelected :setSelected,
      getSelected :getSelected,
      getByCid:getByCid,
      getCidMap:getCidMap,
      add:add,
      update:update,
      remove:remove
    };
  })();



  initModule = function () {
    var catalog_list, newCatalog, catalogs=[];


    stateMap.catalog_selected = null;

    if (isFakeData) {
      catalog_list = note.fake.getCatalogList();

      catalog_list.forEach(function(catalog_map){
        newCatalog = makeCatalog({
          cid: catalog_map._id,
          title: catalog_map.title,
          id: catalog_map._id,
          note_count: catalog_map.note_count
        });
        catalogs.push(newCatalog);
      });

      stateMap.catalog_db = TAFFY(JSON.stringify(catalogs));
    }
  };




  return {
    catalog:catalog,
    initModule: initModule
  };

})();