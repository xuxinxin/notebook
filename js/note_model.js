define(['taffy', 'fake'], function (__taffy, fake) {
  var
    note_model = {},
    state_map = {
      db: TAFFY(),
      selected: null
    },
    isFakeData = true,
    note_proto, makeNote;

  note_proto = {
    isSelected: function () {
      return this.id === state_map.selected.id;
    }
  };

  makeNote = function(note_map){
    var
      note,
      id = note_map.id,
      title = note_map.title,
      content = note_map.content;

    if(id === undefined || !title) {
      console.error('Note id and title required');
    }

    note = Object.create(note_proto);
    note.id = id;
    note.title = title;
    note.content = content;

    return note;
  };

  note_model.getDb = function(){
    return state_map.db;
  }

  function isArray(a){
    return toString.apply(a) === '[object Array]';
  }



  note_model.initModule = function (id) {
    console.log('Note model init...');
    var note_list, notes = [], new_note;

    state_map.selected = null;

    if (isFakeData) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {

          note_list = fake.getNotebookList(id);

          note_list.forEach(function(note_map){
            new_note = makeNote({
              title: note_map.title,
              id: note_map.id,
              content: note_map.content
            });

            notes.push(new_note);
          });

          state_map.db = TAFFY(JSON.stringify(notes));

          resolve(note_list);

        }, 200);
      })
    }

  };

  return note_model;
});