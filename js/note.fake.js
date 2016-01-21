/**
 * Created by star on 16/1/19.
 */
/*
 * note.fake.js
 * Fake data module
 */

note.fake = (function () {
  'use strict'
  var getCatalogList = function () {
    return [
      {
        title: "HTML",
        note_count: 5,
        _id: "id_01"
      },
      {
        title: "CSS",
        note_count: 10,
        _id: "id_02"
      },
      {
        title: "JS",
        note_count: 0,
        _id: "id_03"
      },
      {
        title: "Java",
        note_count: 22,
        _id: "id_04"
      }
    ];
  };

  return {getCatalogList: getCatalogList};
})();