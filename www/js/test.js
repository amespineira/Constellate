if ('a'>'b'){
  console.log('a'>'b');
}
if ('a'<'b'){
}
var a="a";
var b="b"
console.log((a>b)*1);
console.log((a<b)*-1);
console.log();

var obj={};
console.log(empty(obj));
obj={
  0:'nlakads'
}
console.log(empty(obj));
function empty(object){
  for(var key in object){
    return false;
  }
  return true;
}
