angular.module('starter.filters',[])
.filter('custom', function() {
  return function(input, search) {
    if (!input) return input;
    if (!search) return input;
    var expected = ('' + search).toLowerCase();
    var result = {};
    console.log(input);
    angular.forEach(input, function(value, key) {
      if(value.name){
        var actual = ('' + value.name).toLowerCase();
      }
      else{
        var actual = ('' + value.first_name+" "+value.last_name).toLowerCase();

      }
      if (actual.indexOf(expected) !== -1) {
        result[key] = value;
      }
    });
    return result;
  }
})
.filter('placeSearch', function() {
  return function(input, search) {
    if (!input || !search.type) return input;

    if (!search.name && !search.text && !search.noteType) return input;
    var result = {};
    console.log(search);
    switch(search.type){
        case('name'):
          var expected = ('' + search.name).toLowerCase();

          angular.forEach(input, function(value, key) {
            var actual = ('' + value.first_name+" "+value.last_name).toLowerCase();
            if (actual.indexOf(expected) !== -1) {
              result[key] = value;
            }
          })
          break;
        case('note'):
          var noteTextCheck=(search.text)?
          function(note, expectedText){
            return note.text.toLowerCase().indexOf(expectedText) !==-1
          } : function(note, expectedText){
            return true;
          };

          var noteTypeCheck=(search.noteType)? function(note, expectedType){
            return note.type.toLowerCase().indexOf(expectedType) !==-1
          }: function(note, expectedType){
            return true;
          }
          var expectedType=('' + search.noteType).toLowerCase();
          var expectedText=('' + search.text).toLowerCase();
          angular.forEach(input, function(person, key) {
            angular.forEach(person.notes, function(note) {
              if (noteTypeCheck(note, expectedType) && noteTextCheck(note, expectedText)) {
                result[key] = person;
              }
            })
          })

          break;
    }

    return result;
  }
})
.filter('capitalize', function(){
  return function (str){
    return str ? str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()}) : str;
  }
})
