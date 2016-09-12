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
.filter('allSearch', function() {
  return function(input, search) {
    if (!input || !search) return input;

    var result = {};
    console.log(search);

    var expected = ('' + search).toLowerCase();
    var noteTextCheck=function(note, expectedText){
      return note.text.toLowerCase().indexOf(expectedText) !==-1
    }

    var noteTypeCheck= function(note, expectedType){
      return note.type.toLowerCase().indexOf(expectedType) !==-1
    }
    angular.forEach(input, function(value, key) {
        var actual = ('' + value.first_name+" "+value.last_name).toLowerCase();
        if (actual.indexOf(expected) !== -1) {
          result[key] = value;
        }
        angular.forEach(value.notes, function(note) {
          if (noteTypeCheck(note, expected) || noteTextCheck(note, expected)) {
            result[key] = value;
          }
        })
    })



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
.filter('www', function(){
  return function(url){
    if (url.indexOf("www")>-1){
      return url.substring(url.indexOf("www")+4, url.length)
    } else if (url.indexOf("http")>-1){
      return url.substring(url.lastIndexOf("/")+1, url.length)
    } else {
      return url
    }
  }
})
