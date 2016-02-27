define(['taffy', 'fake'], function (__taffy, fake) {
  var catalog_model = {},
    state_map = {
      db: TAFFY(),
      selected: null
    },
    isFakeData = true,
    catalog_proto, makeCatalog;

  catalog_proto = {
    isSelected: function () {
      return this.id === state_map.selected.id;
    }
  };


  makeCatalog = function (catalog_map) {
    var
      catalog,
      id = catalog_map.id,
      title = catalog_map.title,
      note_count = catalog_map.note_count;

    if (id == undefined || !title) {
      console.error('client id and title required');
    }

    catalog = Object.create(catalog_proto);
    catalog.title = title;
    catalog.note_count = note_count;
    catalog.id = id;

    return catalog;
  };

  catalog_model.getDb = function () {
    return state_map.db;
  };

  catalog_model.setSelected = function (id) {
    var db = this.getDb();
    state_map.selected = db({id: id}).first();
  };

  catalog_model.getSelected = function () {
    return state_map.selected;
  };

  catalog_model.getById = function (id) {
    var db = this.getDb();
    return db({id: id}).first();
  };

  catalog_model.add = function (catalog_map) {
    var new_catalog = {
      title: catalog_map.title,
      note_count: catalog_map.note_count
    };

    if(isFakeData){
      return new Promise(function(resolve, reject){
        setTimeout(function(){
          var db = this.getDb();
          new_catalog.id = 'id_' + String(Math.random()*10000>>0);
          new_catalog = makeCatalog(new_catalog);
          db.insert(JSON.stringify(new_catalog));
          resolve(new_catalog);
        }.bind(this),500);
      }.bind(this))
    }
  };

  catalog_model.update = function(catalog_map) {

    catalog_map.id = catalog_map.id || state_map.selected.id;
    catalog_map.title = catalog_map.title || state_map.selected.title;
    catalog_map.note_count = catalog_map.note_count || state_map.selected.note_count;

    var previous_catalog = state_map.selected, db;
    if(previous_catalog.title !== catalog_map.title || previous_catalog.note_count !== catalog_map.note_count){
      // TODO update server
      console.log('catalog update');

      db = this.getDb();
      db({id:catalog_map.id}).update({title:catalog_map.title,note_count:catalog_map.note_count});
      this.setSelected(catalog_map.id);
      console.log(db().get());
      console.log(state_map.selected);
    }
  };

  catalog_model.remove = function(catalog_id){
    if(catalog_id != null){
      var db = this.getDb();
      db({id:catalog_id}).remove();
      console.log(db().get());
    }
  }

  catalog_model.initModule = function () {
    console.log('Catalog model init...');
    var catalog_list, newCatalog, catalogs = [];

    state_map.selected = null;

    if (isFakeData) {
      return new Promise(function(resolve,reject){

        setTimeout(function(){
          catalog_list = fake.getCatalogList();

          catalog_list.forEach(function (catalog_map) {
            newCatalog = makeCatalog({
              title: catalog_map.title,
              id: catalog_map.id,
              note_count: catalog_map.note_count
            });
            catalogs.push(newCatalog);
          });

          state_map.db = TAFFY(JSON.stringify(catalogs));

          resolve(catalog_list);
        },200);

      });

    }

  };


  return catalog_model;
});