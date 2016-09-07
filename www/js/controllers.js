angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})
.controller('PeopleCtrl', function($scope, $http, User, Chats, Data, $state) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  console.log("here");
  $scope.controllertest="words";
  $scope.view={}
  $scope.$on('$ionicView.enter', function(e) {
    console.log("here");
    console.log(User);
    var user=User.getCurrUser();
    if(user.loggedin===true){
      console.log("loggedin");
      $http.get('http://localhost:4567/users/'+user.id+"/data/"+window.localStorage.getItem('token')).then(function(res){
        if(res.data.error!=true){
          console.log(res.data);
          Data.formatData(res.data)
          $scope.view.places=Data.getData();

          $scope.view.people=Data.getPeople();
          }
          console.log($scope.view.people);

        console.log($scope.view.places);
      })
    }

    $scope.update=function(){
      $http.get('http://localhost:4567/users/'+user.id+"/data/"+window.localStorage.getItem('token')).then(function(res){
        if(res.data.error!=true){
          console.log(res.data);
          Data.formatData(res.data)
          $scope.view.places=Data.getData();
        }
        console.log($scope.view.places);
      })
    }
    $scope.addPerson = function(){
      $state.go("new-people");
    }
  });
  $scope.display=function(person){
    Data.setSelected("people", person.people_id)
    $state.go("tab.people-show")
  }

})
.controller('PlacesCtrl', function($scope, $http, User, Chats, Data, $state) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  console.log("here");
  $scope.controllertest="words";
  $scope.view={}
  $scope.$on('$ionicView.enter', function(e) {
    console.log("here");
    console.log(User);
    var user=User.getCurrUser();
    if(user.loggedin===true){
      console.log("loggedin");
      $http.get('http://localhost:4567/users/'+user.id+"/data/"+window.localStorage.getItem('token')).then(function(res){
        if(res.data.error!=true){
          console.log(res.data);
          Data.formatData(res.data)
          $scope.view.places=Data.getData();
        }
        console.log($scope.view.places);
      })
    }
    $scope.addPlace=function(){
      $http.post('http://localhost:4567/places/'+window.localStorage.getItem('token'), {
        name:$scope.view.newName
      }).then(function(res){
        $scope.update();
        $scope.view.newName="";
      })
    }
    $scope.update=function(){
      $http.get('http://localhost:4567/users/'+user.id+"/data/"+window.localStorage.getItem('token')).then(function(res){
        if(res.data.error!=true){
          console.log(res.data);
          Data.formatData(res.data)
          $scope.view.places=Data.getData();
        }
        console.log($scope.view.places);
      })
    }
  });
  $scope.display=function(place){
    Data.setSelected("places", place.id)
    $state.go("tab.places-show")
  }
  $scope.textFilter=function(place){
  return ($scope.view.search===undefined)? true :!(place.name.indexOf($scope.view.search)===-1 )
}
})
.controller('PlacesDisplayCtrl', function($scope, $stateParams, $http, User, Data,  $location, $state){
  console.log("in this controller...");
  $scope.view={}
  $scope.view.search={}
  $scope.$on('$ionicView.enter',function(){

    $scope.view.place=Data.getSelected("places");
    console.log($scope.view.place);

  })
  $scope.display=function(person){
    Data.setSelected("people", person.people_id)
    $state.go("tab.people-show")
  }
})
.controller('PeopleDisplayCtrl', function($scope, $stateParams, $http, User, Data,  $location, $state){
  console.log("in the person display controller...");
  $scope.view={}
  $scope.$on('$ionicView.enter',function(){
    $scope.user=User.getCurrUser();

    $scope.view.person=Data.getSelected("people");
    console.log($scope.view.person);
    $scope.addNote=function(){
      $http.post('http://localhost:4567/notes/'+$scope.view.person.people_id+"/"+window.localStorage.getItem('token'), {
        type:$scope.view.newType,
        text:$scope.view.newText
      }).then(function(res){
        $scope.update();
        $scope.view.newType=''
        $scope.view.newText=''
      })
    }
    $scope.addLink=function(){
      $http.post('http://localhost:4567/links/'+$scope.view.person.people_id+"/"+window.localStorage.getItem('token'), {
        link_name:$scope.view.newName,
        url:$scope.view.newUrl
      }).then(function(res){
        $scope.update();
        $scope.view.newName=''
        $scope.view.newUrl=''
      })
    }
  })
  $scope.update=function(){
    $http.get('http://localhost:4567/users/'+$scope.user.id+"/data/"+window.localStorage.getItem('token')).then(function(res){
      if(res.data.error!=true){
        console.log(res.data);
        Data.formatData(res.data)
        $scope.view.places=Data.getData();
        $scope.view.person=Data.getSelected("people");

      }
      console.log($scope.view.places);
    })
  }
})
.controller('LoginCtrl', function($scope, $stateParams, $http, User, $location, $state){
  console.log("stuff");

  $scope.view={}
  $scope.$on('$ionicView.enter',function(){
    console.log("get ready for login");
  })
  $scope.login=function(){
    console.log("gonna login");
    console.log($scope);
    console.log($scope.view.username);
    console.log($scope.view.password);
    $http.post('http://localhost:4567/auth/login', {
      username:$scope.view.username,
      password:$scope.view.password,
    }).then(function(res){
      if(res.data==="User Not Found"){
        console.log(res.data);
      $scope.view.errormessage=res.data;
      }
      else{
        console.log(res.data);
        window.localStorage.setItem("token", res.data);
        $http.get('http://localhost:4567/users/' +window.localStorage.getItem('token')).then(function(res){
          if(res.data.error!=true){
            console.log(res.data);
            User.login(res.data)
          }
        })

      }
    })
  }
  $scope.signup=function(){
    console.log("gonna signup");
    console.log($scope);
    console.log($scope.view.username);
    console.log($scope.view.password);
    console.log($scope.view.accountType);
    $http.post('http://localhost:4567/auth/signup', {
      username:$scope.view.username,
      password:$scope.view.password,
    }).then(function(res){
      if(res.data==="User Not Found"){
        console.log(res.data);
      $scope.view.errormessage=res.data;
      }
      else{
        console.log(res.data);
        window.localStorage.setItem("token", res.data);
        $http.get('http://localhost:4567/users/' +window.localStorage.getItem('token')).then(function(res){
          if(res.data.error!=true){
            console.log(res.data);
            User.login(res.data)
          }
        })

      }
    })
  }

})
.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, User, Data) {

  $scope.logout=function(){
    User.logout();
    Data.clear();
    window.localStorage.removeItem("token");
  }
})

.controller('NewPerson', function($scope, $ionicPopup, $timeout, Places, People, Notes, Data, Links, User, $state) {
  $scope.notes = [];
  $scope.links = [];
  $scope.places = Data.getData();
  $scope.input = {
    link_name: '', url: '', note_text:'', note_type:'', first: '', last: '', place: ''
  }
  $scope.addNote = function(){
    $scope.notes.push({text: $scope.input.note_text, type: $scope.input.note_type})
  }
  $scope.addLink = function(){
    $scope.links.push({link_name: $scope.input.link_name, url: $scope.input.url})
  }
  $scope.showPopup = function() {
    if ($scope.input.place === "NEW"){
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
              Places.addNew({name: $scope.input.pop_place});
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
      } else {
        console.log('Nothing happens');
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
     } else {
       console.log('Nothing happens');
     }
   });
 };
   $scope.submitNew = function(){
     People.createNew({first_name: $scope.input.first, last_name: $scope.input.last, place_id: $scope.input.place}).then(function(person_id){
       for (var i = 0; i < $scope.notes.length; i++) {
         Notes.addNew($scope.notes[i], person_id.data)
       }
       for (var y = 0; y < $scope.links.length; y++) {
         Links.addNew($scope.links[y], person_id.data)
       }
     })
   }
   $scope.peopleRedirect = function(){
     $state.go('tab.people')
   }
});
