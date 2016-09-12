angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})
.controller('PeopleCtrl', function($scope, $http, User, Chats, Data, $state, $filter, Url) {
  var notes = [];
  var saved = [];
  var colors = ["#43C7BA", "#E04833", "#E6BA02", "#00BC7E", "#9F8B75", "#B797F3", "#C3D3D7", "#A99616"]
  $scope.getColor = function (element){
    if (saved.indexOf(element.text) === -1){
      var color = colors[Math.floor(Math.random()*colors.length)]
      var text = element.text;
      saved.push(text)
      notes.push({"text": text, "color": color})
      element.color = color;
    } else {
      notes.forEach(function(note){
        if (note.text == element.text){
          element.color = note.color;
        }
      })
    }
  }
  $scope.controllertest="words";
  $scope.view={}
  $scope.$on('$ionicView.enter', function(e) {
    User.loggedOutRedirect();
    var user=User.getCurrUser();
    $scope.update();
  });
  $scope.update=function(){
    Data.update().then(function(){
      $scope.view.places=Data.getData();
      $scope.view.people=Data.getPeople()
    })
  }
  $scope.addPerson = function(){
    $state.go("new-person");
  }
  $scope.display=function(person){
    Data.setSelected("people", person.people_id)
    $state.go("tab.people-show")
  }

})
.controller('PlacesCtrl', function($scope, $http, User, Chats, Data, $state, $filter, Url) {
  $scope.newView = false;
  $scope.toggleNew = function(){
    $scope.newView = !$scope.newView;
  }
  $scope.controllertest="words";
  $scope.view={}
  $scope.$on('$ionicView.enter', function(e) {
    User.loggedOutRedirect();
    var user=User.getCurrUser();
    $scope.update();
  });
  $scope.addPlace=function(){
    $http.post(Url.getUrl()+'/places/'+window.localStorage.getItem('token'), {
      name:$scope.view.newName
    }).then(function(res){
      $scope.update();
      $scope.view.newName="";
    })
  }
  $scope.update=function(){
    Data.update().then(function(){
        $scope.view.places=Data.getData();
    })
  }
  $scope.display=function(place){
    Data.setSelected("places", place.id)
    $state.go("tab.places-show")
  }
})
.controller('PlacesDisplayCtrl', function($scope, $stateParams, $http, Url, User, Data, $ionicPopup, $location, $state){
  $scope.view={}
  $scope.view.search={}
  $scope.view.showOpt=false;
  $scope.view.editing=false;
  $scope.$on('$ionicView.enter',function(){

    $scope.view.place=Data.getSelected("places");
    $scope.view.newName=$scope.view.place.name

  })
  $scope.edit=function(){
    if($scope.view.editing===true){
      $http.post(Url.getUrl()+'/places/update/'+$scope.view.place.id+"/"+window.localStorage.getItem('token'), {
        name:$scope.view.newName,
      }).then(function(res){
        $scope.update();
      })
      // "/places/update/:place_id/:token
    }
    $scope.view.editing=!$scope.view.editing
  }
  $scope.confirmDelete = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Delete Place',
      template: 'Are you sure you want to delete this place? It will delete all people associated.'
    });

    confirmPopup.then(function(res) {
      if(res) {
        $http.get(Url.getUrl()+'/places/delete/'+$scope.view.place.id+"/"+window.localStorage.getItem('token')).then(function(res){
          $state.go("tab.places")
        })
      }
    });
  };
  $scope.addPerson=function(){
    $state.go("new-person")
  }
  $scope.display=function(person){
    Data.setSelected("people", person.people_id)
    $state.go("tab.people-show")
  }
  $scope.update=function(){
    Data.update().then(function(){
        $scope.view.places=Data.getData();
        $scope.view.place=Data.getSelected("places");
    })
  }
})
.controller('PeopleDisplayCtrl', function($scope, $stateParams, $http, User, Data, $ionicPopup, $location, $state, $filter, Links, Notes, Url){
  $scope.view={}
  $scope.view.search={}
  $scope.view.showOpt=false;
  $scope.view.editing=false;
  $scope.$on('$ionicView.enter',function(){
    $scope.user=User.getCurrUser();
    $scope.places = Data.getData();
    $scope.places["0"] = {id: "NEW", name: "+ Add New Place"}
    $scope.input={}
    $scope.view.person=Data.getSelected("people");
    $scope.view.types={};
    $scope.update();
    console.log($scope.view.types);
    $scope.view.newFirstName=$scope.view.person.first_name
    $scope.view.newLastName=$scope.view.person.last_name
    $scope.input.place=$scope.places[$scope.view.person.place_id]
    $scope.addNote=function(){
      $http.post(Url.getUrl()+'/notes/'+$scope.view.person.people_id+"/"+window.localStorage.getItem('token'), {
        type:$scope.view.newType,
        text:$scope.view.newText
      }).then(function(res){
        $scope.update();
        $scope.view.newType=''
        $scope.view.newText=''
      })
    }
    $scope.addLink=function(){
      $http.post(Url.getUrl()+'/links/'+$scope.view.person.people_id+"/"+window.localStorage.getItem('token'), {
        link_name:$scope.view.newName,
        url:$scope.view.newUrl
      }).then(function(res){
        $scope.update();
        $scope.view.newName=''
        $scope.view.newUrl=''
      })
    }
    $scope.showConfirmNote = function(index) {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Delete Note',
       template: 'Are you sure you want to remove this note?'
     });
     confirmPopup.then(function(res) {
       if(res) {
         Notes.delete(index);
         $scope.update();
       }
     });
   };
   $scope.showConfirmLink = function(index) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Delete Link',
      template: 'Are you sure you want to remove this link?'
    });
    confirmPopup.then(function(res) {
      if(res) {
        Links.delete(index.link_id);
        $scope.update();
      }
    });
  };
  })
  $scope.edit=function(){
    if($scope.view.editing===true){
      $http.post(Url.getUrl()+'/people/update/'+$scope.view.person.people_id+"/"+window.localStorage.getItem('token'), {
        first_name:$scope.view.newFirstName,
        last_name:$scope.view.newLastName,
        place_id:$scope.input.place.id
      }).then(function(res){
        $scope.update();
      })
    }
    $scope.view.editing=!$scope.view.editing
  }
  $scope.showPopup = function() {
    if ($scope.input.place.id === "NEW"){
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="input.pop_place">',
      title: 'Place Name',
      subTitle: 'please enter a place name',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.input.pop_place) {
              e.preventDefault();
            } else {
              Places.addNew({name: $scope.input.pop_place}).then(function(data){
                $scope.update().then(function(id){
                  $scope.input.place = {id: id, name: $scope.input.pop_place};
                });
              });
            }
          }
        },
      ]
    });
    }
   };
   $scope.confirmDelete = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Delete Person',
       template: 'Are you sure you want to delete this Person?'
     });

     confirmPopup.then(function(res) {
       if(res) {
         $http.get(Url.getUrl()+'/people/delete/'+$scope.view.person.people_id+"/"+window.localStorage.getItem('token')).then(function(res){
           $state.go("tab.people")
         })
       }
     });
   };
  $scope.update=function(){
    Data.update().then(function(){
      $scope.view.types={};

        $scope.view.places=Data.getData();
        $scope.view.person=Data.getSelected("people");
        $scope.view.person.notes.forEach(function(note){
          if(!$scope.view.types[note.type]){
            $scope.view.types[note.type]={
              type: note.type,
              notes: []
            }
          }
          $scope.view.types[note.type].notes.push(note);
        })
    })
  }
  $scope.goToPeople=function(){
    $state.go('tab.people')
  }
  var notes = [];
  var saved = [];
  var colors = ["#43C7BA", "#E04833", "#E6BA02", "#00BC7E", "#9F8B75", "#B797F3", "#C3D3D7", "#A99616"]
  $scope.getColor = function (element){
    if (saved.indexOf(element.text) === -1){
      var color = colors[Math.floor(Math.random()*colors.length)]
      var text = element.text;
      saved.push(text)
      notes.push({"text": text, "color": color})
      element.color = color;
    } else {
      notes.forEach(function(note){
        if (note.text == element.text){
          element.color = note.color;
        }
      })
    }
  }
})
.controller('LoginCtrl', function($scope, $stateParams, $http, User, Url, $location, $state, $rootScope){
  $scope.loggedInRedirect = function(){
    if(window.localStorage.getItem('token')){
        $http.get(Url.getUrl()+'/users/' +window.localStorage.getItem('token')).then(function(res){
          if(res.data==='invalid token'){
            window.localStorage.removeItem("token");
          }
          else{
            User.login(res.data)
            $state.go('tab.places')
          }
        })
    }
  }
  $scope.$on('$ionicView.enter', function(e) {
    $scope.view={}
    $scope.loggedInRedirect();
  });

  $scope.login=function(){
    if ($scope.view.username && $scope.view.password){
      $http.post(Url.getUrl()+'/auth/login', {
        username:$scope.view.username,
        password:$scope.view.password,
      }).then(function(res){
        if(res.data==="User not found"){
          console.log(res.data);
        $scope.view.errormessage=res.data;
        User.showAlert("Invalid username/password combination")
        }
        else if(res.data==="Incorrect Password"){
          User.showAlert("Invalid username/password combination")
        }
        else{
          $scope.view.password=null;
          $scope.view.username=null;
          window.localStorage.setItem("token", res.data);
          $http.get(Url.getUrl()+'/users/' +window.localStorage.getItem('token')).then(function(res){
            if(res.data.error!=true){
              User.login(res.data);
              $state.go('tab.places');
            }
          })
        }
      })
    } else {
      User.showAlert("Enter Username and Password")
    }
  }
  $scope.signup=function(){
    if ($scope.view.username && $scope.view.password){
      $http.post(Url.getUrl()+'/auth/signup', {
        username:$scope.view.username,
        password:$scope.view.password,
      }).then(function(res){
          if(res.data==="User not found"){
            $scope.view.errormessage=res.data;
            User.showAlert("Username taken")
          }
          else if(res.data==="Username taken"){
            User.showAlert("Username taken");
          }
          else{
            window.localStorage.setItem("token", res.data);
            $http.get(Url.getUrl()+'/users/' +window.localStorage.getItem('token')).then(function(res){
              if(res.data.error!=true){
                User.login(res.data);
                $state.go('tab.places');
              }
            })
          }
      })
    } else {
      User.showAlert("Enter Username and Password")
    }
  }
})
.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, User, Data, $state) {
  $scope.getUsername = function(){
    if (User.getCurrUser().username !== null){
      $scope.user = User.getCurrUser().username;
    }
  }

  $scope.$on('$ionicView.enter', function(){
    $scope.getUsername();
    $scope.$on('$ionicView.enter', function(e) {
      User.loggedOutRedirect();
    });
  });
  $scope.logout=function(){
    User.logout();
    Data.clear();
    window.localStorage.removeItem("token");
    $state.go('main')
  }
})

.controller('NewPersonCtrl', function($scope, $ionicPopup, $http, Places, Url, People, Notes, Data, Links, User, $state) {
  $scope.form = {
    clear: function(){
      $scope.input = {
        link_name: '', url: '', note_text:'', note_type:'', first: '', last: '', place: {id: '', name: ''}
      }
    }
  }
  $scope.$on('$ionicView.enter', function(){
    $scope.notes = [];
    $scope.links = [];
    $scope.places = Data.getData();
    $scope.places["0"] = {id: "NEW", name: "+ Add New Place"}

    $scope.input = {
      link_name: '', url: '', note_text:'', note_type:'', first: '', last: '', place: ''
    }
    $scope.input.place = Data.getSelected("places");
  })
  $scope.addNote = function(){
    if ($scope.input.note_text.length !== 0 && $scope.input.note_type.length !== 0){
      $scope.notes.push({text: $scope.input.note_text, type: $scope.input.note_type})
      $scope.input.note_text = '';
      $scope.input.note_type = '';
    }
  }
  $scope.addLink = function(){
    if ($scope.input.link_name.length !== 0 && $scope.input.url.length !== 0){
      $scope.links.push({link_name: $scope.input.link_name, url: $scope.input.url})
      $scope.input.url = '';
      $scope.input.link_name = '';
    }
  }
  $scope.update = function(){
    return    Data.update().then(function(){
        $scope.places=Data.getData();
        $scope.places["0"] = {id: "NEW", name: "+ Add New Place"}
        var newest=0;
        for(var key in $scope.places){
          if(Number(key)>newest){
            newest=Number(key)
          }
        }
        return $scope.places[newest].id;

    })
  }
  $scope.showPopup = function() {
    if ($scope.input.place.id === "NEW"){
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="input.pop_place">',
      title: 'Place Name',
      subTitle: 'please enter a place name',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.input.pop_place) {
              e.preventDefault();
            } else {
              Places.addNew({name: $scope.input.pop_place}).then(function(data){
                $scope.update().then(function(id){
                  $scope.input.place = {id: id, name: $scope.input.pop_place};
                });
              });
            }
          }
        },
      ]
    });
    }
   };
   $scope.showConfirmNote = function(index) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Delete Note',
      template: 'Are you sure you want to remove this note?'
    });
    confirmPopup.then(function(res) {
      if(res) {
        $scope.notes.splice(index, 1);
      }
    });
  };
  $scope.showConfirmLink = function(index) {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Delete Link',
     template: 'Are you sure you want to remove this link?'
   });
   confirmPopup.then(function(res) {
     if(res) {
       $scope.links.splice(index, 1);
     }
   });
 };
   $scope.submitNew = function(){
     return People.createNew({first_name: $scope.input.first, last_name: $scope.input.last, place_id: $scope.input.place.id}, $scope.notes, $scope.links).then(function(){
       setTimeout($scope.peopleRedirect, 200);
     })
   }
   $scope.peopleRedirect = function(){
     $state.go('tab.people')
   }
});
