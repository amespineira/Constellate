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
});
