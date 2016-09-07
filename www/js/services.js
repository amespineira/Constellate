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
  var data={
    places:{},
    people:{}
  }
  var selected={
    place:null,

  }
  return {
    formatData: function(apiData){
      data.places={};
      data.people={};
      apiData.places.forEach(function(place){
        data.places[Number(place.id)]={
          id:Number(place.id),
          name:place.name,
          people:[]
        };
      })
      apiData.people.forEach(function(person){
        data.people[Number(person.people_id)]=person
        data.places[Number(person.place_id)].people.push(data.people[Number(person.people_id)]);
      })

    },
    getData: function(){
      return data.places;
    },
    getPeople: function(){
      return data.people;
    },
    setSelected: function(type, id){
      selected[type]=id
    },
    getSelected: function(type){
      console.log(type);
      console.log(selected);
      console.log(data);
      console.log(data[type][selected[type]]);
      return data[type][selected[type]]
    },
    clear: function(){
      data={
        places:{},
        people:{}
      }
      selected={
        place:null,

      }
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
})
.service("Places", function($http, $window){
  this.addNew = function(data){
  var url = `http://localhost:4567/places/${window.localStorage.getItem('token')}`
  return $http.post(url, data)
  .success(function(response){
      console.log("created place")
  })
  .error(function (error, status){
      console.log(error, status);
    });
  }
})
.service("People", function($http, $window){
  this.createNew = function(data){
  var url = `http://localhost:4567/people/${data.place_id}/${window.localStorage.getItem('token')}`
  console.log(url);
  return $http.post(url, data)
  .success(function(response){
      console.log("created person")
  })
  .error(function (error, status){
      console.log(error, status);
    });
  }
})
.service("Notes", function($http, $window){
  this.addNew = function(data, person_id){
  var url = `http://localhost:4567/notes/${person_id}/${window.localStorage.getItem('token')}`
  return $http.post(url, data)
  .success(function(response){
      console.log("created note")
  })
  .error(function (error, status){
      console.log(error, status);
    });
  }
})
.service("Links", function($http, $window){
  this.addNew = function(data, person_id){
  var url = `http://localhost:4567/links/${person_id}/${window.localStorage.getItem('token')}`
  return $http.post(url, data)
  .success(function(response){
      console.log("link note")
  })
  .error(function (error, status){
      console.log(error, status);
    });
  }
})
