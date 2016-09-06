angular.module('starter.services', [])
.factory('User', function(){
  var user = {
    username:null,
    loggedin:false,
    id:null
  }

  return {
    getCurrUser: function(){
      return user;
    },
    login: function(userInfo){
      user.username=userInfo.username;
      user.loggedin=true;
      user.id=userInfo.id
    },
    logout: function(){
      user.username=null
      user.loggedin=false
      user.id=null
    }
  }
})
.factory('Data', function(){
  var places={}
  var selected={
    place:null,

  }
  return {
    formatData: function(apiData){
      places={};
      apiData.places.forEach(function(place){
        places[Number(place.id)]={
          id:Number(place.id),
          name:place.name,
          people:[]
        };
      })
      apiData.people.forEach(function(person){
        places[Number(person.place_id)].people.push(person);
      })

    },
    getData: function(){
      return places;
    },
    setSelected: function(type, id){
      selected[type]=id
    },
    getSelected: function(type){
      return places[selected[type]]
    }
  }
})
.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
