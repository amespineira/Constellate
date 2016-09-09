angular.module('starter.services', [])
.factory('User', function($rootScope, $state, $ionicPopup){
  var user = {
    username:null,
    loggedin:false,
    id:null
  }
  return {
    active: function(){
        return user.loggedin;
    },
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
    },
    showAlert: function(text) {
      var alertPopup = $ionicPopup.alert({
        title: text
      });
    },
    loggedOutRedirect:function(){
      if (!user.loggedin){
        console.log("this");
        $state.go("main");
      }
    }
  }
})
.factory('Data', function(User, Url, $http){
  var data={
    places:{},
    people:{}
  }
  var selected={
    place:null,

  }
  function formatData(apiData) {
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

  }
  return {
    formatData: function(apiData){
      formatData(apiData);
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
    },
    update: function(){
      var user=User.getCurrUser();
      return $http.get(Url.getUrl()+'/users/'+user.id+"/data/"+window.localStorage.getItem('token')).then(function(res){
        if(res.data.error!=true){
        //  console.log(res.data);
        console.log(this);
          formatData(res.data)
        }
      })
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
.service("Places", function($http, Url, $window){
  this.addNew = function(data){
  var url = `${Url.getUrl()}/places/${window.localStorage.getItem('token')}`
  return $http.post(url, data)
  .success(function(response){
      console.log("created place")
  })
  .error(function (error, status){
      console.log(error, status);
    });
  }
})
.service("People", function($http, Url,  Notes, Links,  $window){
  this.createNew = function(data, links, notes){
  var url = `${Url.getUrl()}/people/${data.place_id}/${window.localStorage.getItem('token')}`
  console.log(url);
  return $http.post(url, data)
  .success(function(response){
    console.log("success");

      console.log("created person")
  })
  .error(function (error, status){
      console.log(error, status);
  }).then(function(res){
      notes.forEach(function(note){
        Notes.addNew(note, res.data).then(function(res){
        })
      })
      links.forEach(function(link){
        Links.addNew(link, res.data).then(function(res){
        });
      })
    })
  }
})
.service("Notes", function($http, Url, $window){
  this.addNew = function(data, person_id){
  var url = `${Url.getUrl()}/notes/${person_id}/${window.localStorage.getItem('token')}`
  return $http.post(url, data)
  .success(function(response){

      console.log("created note")
  })
  .error(function (error, status){
      console.log(error, status);
    });
  }
  this.delete = function(id){
  var url = `${Url.getUrl()}/notes/${id}/delete/${window.localStorage.getItem('token')}`
  return $http.post(url)
  .success(function(response){
      console.log(response)
  })
  .error(function (error, status){
      console.log(error, status);
    });
  }
})
.service("Links", function($http, $window, Url){
  this.addNew = function(data, person_id){
  var url = `${Url.getUrl()}/links/${person_id}/${window.localStorage.getItem('token')}`
  return $http.post(url, data)
  .success(function(response){
      console.log("link note")
  })
  .error(function (error, status){
      console.log(error, status);
    });
  }
  this.delete = function(id){
  var url = `${Url.getUrl()}/links/${id}/delete/${window.localStorage.getItem('token')}`
  console.log(url);
  return $http.post(url)
  .success(function(response){
      console.log(response)
  })
  .error(function (error, status){
      console.log(error, status);
    });
  }
})
.service("Url", function(){
  var enviroment="production"
  return {
    getUrl : function(){
      switch(enviroment){
        case "production":
          return "https://ancient-sierra-76429.herokuapp.com"
          break;
        case "development":
        return "http://localhost:4567"
      }
    }
  }
})
